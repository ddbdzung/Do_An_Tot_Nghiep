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
  const { customerId, order, guest, method } = createTransactionDto;
  if (method !== TRANSCTION_METHODS.COD) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Only COD method is supported now',
    );
  }

  const transactionSchema = {
    method,
  };
  if (guest) {
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
    return {
      product: item.productId,
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
