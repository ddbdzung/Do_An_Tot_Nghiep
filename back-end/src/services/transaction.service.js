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
const { TRANSCTION_METHODS } = require('../config/constant');

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

  /**
   * Products in Database
   */
  const products = await getProductsByIds(productIds, {
    lean: true,
  });
  if (products.length !== productIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Some product does not exist');
  }

  if (products.some(product => product.quantity < 1)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Some product is out of stock');
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

  const transaction = new Transaction(transactionSchema);
  await Promise.all(
    transactionSchema.products.map(async item => {
      await atomicUpdateProductQuantity(item.product, -item.amount);
    }),
  );

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

  return transactions;
};   
