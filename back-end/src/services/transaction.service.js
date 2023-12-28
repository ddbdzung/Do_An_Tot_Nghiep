const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Transaction } = require('../models');
const logger = require('../config/logger');
const {
  getProductsByIds,
  atomicUpdateProductQuantity,
} = require('./product.service');
const _ = require('lodash');
const { getUserById } = require('./user.service');
const Mongoose = require('mongoose');
const {
  TRANSCTION_METHODS,
  TRANSACTION_STATUS,
} = require('../config/constant');
const { getCategoriesByCode } = require('./category.service');
const {
  CATEGORY_NEED_INSTALL,
} = require('../core/modules/category/category.constant');
const Progress = require('../models/progress.model');
const Worker = require('../models/worker.model');
const { PROGRESS_STATUS } = require('../common/constants.common');
const {
  TAX,
  SHIPPING_FEE,
} = require('../core/modules/transaction/transaction.constant');

exports.getTransactionById = async id => {
  const transaction = await Transaction.findById(id);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  return transaction;
};

exports.queryTransactions = async (filter, options) => {
  const transactions = await Transaction.paginate(filter, options);
  return transactions;
};

exports.createTransaction = async createTransactionDto => {
  const { customerId, order, guest, paymentMethod, extraCustomerInfo } =
    createTransactionDto;
  if (paymentMethod !== TRANSCTION_METHODS.COD) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Only COD method is supported now',
    );
  }

  const transactionSchema = {
    paymentMethod,
    customerInfo: {},
  };
  if (guest) {
    if (!guest.name || !guest.phoneNumber || !guest.address) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Guest name, phone number and address are required',
      );
    }

    transactionSchema.guest = {
      name: guest.name,
      phoneNumber: guest.phoneNumber,
      address: guest.address,
    };
  } else {
    const user = await getUserById(customerId, '', { lean: true });
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
    }

    transactionSchema.customerInfo.name = user.name;
    const validationErrorMessages = [];
    if (!user.phoneNumber) {
      if (!extraCustomerInfo?.phoneNumber) {
        validationErrorMessages.push('Phone number is required');
      } else {
        transactionSchema.customerInfo.phoneNumber =
          extraCustomerInfo.phoneNumber;
      }
    } else {
      transactionSchema.customerInfo.phoneNumber = user.phoneNumber;
    }

    if (!user.address) {
      if (!extraCustomerInfo?.address) {
        validationErrorMessages.push('Address is required');
      } else {
        transactionSchema.customerInfo.address = extraCustomerInfo.address;
      }
    } else {
      transactionSchema.customerInfo.address = user.address;
    }
    if (validationErrorMessages.length > 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        validationErrorMessages.join(', '),
      );
    }

    transactionSchema.customer = new Mongoose.Types.ObjectId(
      customerId.toString(),
    );
  }

  const productIds = order.map(item => item.productId);
  /**
   * Products in Order
   */
  const productFromOrder = _.keyBy(order, 'productId');

  const pProducts = await getProductsByIds(productIds, {
    lean: true,
  });
  const pCategoriesNeedInstall = await getCategoriesByCode(
    CATEGORY_NEED_INSTALL,
    {
      lean: true,
    },
  );
  const [products, categoriesNeedInstall] = await Promise.all([
    pProducts,
    pCategoriesNeedInstall,
  ]);
  if (products.length !== productIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Some product does not exist');
  }

  if (products.some(product => product.quantity < 1)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Some product is out of stock');
  }

  const categoryIdsNeedInstall = categoriesNeedInstall.map(i =>
    i._id.toString(),
  );
  const willSetUpProgress = products.some(
    product => categoryIdsNeedInstall.indexOf(product.category.toString()) > -1,
  );
  if (willSetUpProgress) {
    transactionSchema.hasProgress = true;
  }

  const notEnoughProducts = products.filter(
    product =>
      productFromOrder[product._id.toString()].quantity > product.quantity,
  );
  if (notEnoughProducts.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Not enough products in store: ${notEnoughProducts
        .map(product => product.name)
        .join(', ')}`,
    );
  }

  const serializedProductsInDb = _.keyBy(products, '_id');
  transactionSchema.products = order.map(item => {
    const history = serializedProductsInDb[item.productId].price.history;
    const priceId = history[history.length - 1]._id;
    const priceValue = serializedProductsInDb[item.productId].price.lastValue;
    return {
      product: item.productId,
      productDetail: {
        name: serializedProductsInDb[item.productId].name,
        price: priceValue,
        image:
          serializedProductsInDb[item.productId].images?.at(0)?.url || null,
      },
      amount: item.quantity,
      price: priceId,
    };
  });

  const totalItemPrice = transactionSchema.products?.reduce((acc, product) => {
    const price = product.productDetail.price;
    const amount = product.amount;
    return acc + price * amount;
  }, 0);
  const finalPrice = totalItemPrice + totalItemPrice * TAX + SHIPPING_FEE;
  transactionSchema.totalPrice = finalPrice;

  const transaction = new Transaction(transactionSchema);
  const progress = new Progress({
    transaction: transaction._id,
    status: willSetUpProgress ? PROGRESS_STATUS.SCHEDULING : null,
    customer: transaction.customer,
  });

  await Promise.all([
    ...transactionSchema.products.map(async item => {
      await atomicUpdateProductQuantity(item.product, -item.amount);
    }),
    progress.save(),
  ]);

  return transaction.save();
};

exports.serializeProductInTransaction = async transactionDocument => {
  const serializedProductsInTransaction = _.keyBy(
    transactionDocument.products.map(i => ({
      product: i.product,
      amount: i.amount,
      price: i.price,
    })),
    'product',
  );
  const productsInDB = await getProductsByIds(
    _.map(transactionDocument.products, 'product'),
    {
      lean: true,
    },
  );
  const productsWithPrice = productsInDB.map(item => {
    const { _id, name, unit, price } = item || {};
    if (!_id) return {};

    const exactPrice = price?.history?.find(
      i =>
        i._id.toString() ===
        serializedProductsInTransaction[_id.toString()].price.toString(),
    );
    if (!exactPrice) return {};
    return {
      _id,
      name,
      unit,
      price: exactPrice.value,
      amount: serializedProductsInTransaction[_id.toString()].amount,
    };
  });
  return _.keyBy(productsWithPrice, '_id');
};

exports.getTransactionsByUserId = async userId => {
  const transactions = await Transaction.find({
    customer: userId,
  });

  if (transactions.length === 0) return [];

  const serializedTransactions = _.keyBy(transactions, '_id');
  const transactionIds = _.map(transactions, '_id');
  const progresses = await Progress.find(
    {
      transaction: { $in: transactionIds },
    },
    {},
    { populate: 'workers' },
  ).lean();
  progresses.forEach(progress => {
    const transactionId = progress?.transaction?.toString();
    if (!_.isEmpty(serializedTransactions[transactionId])) {
      serializedTransactions[transactionId] = {
        ..._.cloneDeep(serializedTransactions[transactionId]?.toObject()),
        progress,
      };
    }
  });

  return Object.values(serializedTransactions);
};

exports.updateTransactionById = async (id, updateDto) => {
  const transaction = await Transaction.findById(id);
  if (!transaction)
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');

  if (updateDto.status === transaction.status) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Transaction is already ${transaction.status}`,
    );
  }

  switch (updateDto.status) {
    case TRANSACTION_STATUS.RETURN:
    case TRANSACTION_STATUS.CANCEL: {
      // Rollback product quantity in store
      const products = await getProductsByIds(
        transaction.products.map(i => i.product),
        {
          lean: true,
        },
      );
      await Promise.all(
        products.map(product =>
          atomicUpdateProductQuantity(
            product._id,
            transaction.products.find(
              i => i.product.toString() === product._id.toString(),
            ).amount,
          ),
        ),
      );
      transaction.status = updateDto.status;
      await transaction.save();
      break;
    }

    case TRANSACTION_STATUS.DONE: {
      // Check if all progress is done or not
      // If not, throw error
      // Else, update transaction status
      const progress = await Progress.findOne({
        transaction: id,
      });
      if (!progress) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Progress not found');
      }
      if (progress.status !== PROGRESS_STATUS.DONE) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Progress is not done yet, cannot complete transaction',
        );
      }

      transaction.status = TRANSACTION_STATUS.DONE;
      await transaction.save();
      break;
    }

    case TRANSACTION_STATUS.DELIVERING: {
      const progress = await Progress.findOne({
        transaction: id,
      });
      if (!progress) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Progress not found');
      }
      if (progress.status !== PROGRESS_STATUS.ON_GOING) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Progress is not delivering yet, cannot complete transaction',
        );
      }

      transaction.status = TRANSACTION_STATUS.DELIVERED;
      await transaction.save();
      break;
    }

    case TRANSACTION_STATUS.PREPARING: {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Cannot update transaction to preparing',
      );
    }

    default:
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot update transaction to ${updateDto.status}`,
      );
  }
  return transaction;
};
