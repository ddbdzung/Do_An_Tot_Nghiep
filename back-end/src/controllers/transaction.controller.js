const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  transactionService,
  productService,
  emailService,
} = require('../services');
const responseEmitter = require('../utils/responseEmitter');
const getAuthenticatedUser = require('../common/getAuthenticatedUser');
const _ = require('lodash');

exports.getTransactions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await transactionService.queryTransactions(filter, options);
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], result);
});

exports.createTransactionByUser = catchAsync(async (req, res, next) => {
  const { _id: userId, email } = getAuthenticatedUser(req);
  const { order, method, extraCustomerInfo } = req.body;
  const createTransactionDto = {
    order,
    customerId: userId,
    guest: null,
    method,
    extraCustomerInfo,
  };

  const transaction = await transactionService.createTransaction(
    createTransactionDto,
  );
  const serializedProductsWithPrice =
    await transactionService.serializeProductInTransaction(transaction);

  responseEmitter(
    req,
    res,
    next,
  )(httpStatus.CREATED, 'Transaction created successfully');
  // await emailService.sendBillingEmail(
  //   email,
  //   transaction,
  //   serializedProductsWithPrice,
  // );
});

exports.createTransactionByGuest = catchAsync(async (req, res, next) => {
  const { order, method, userInfo } = req.body;
  const createTransactionDto = {
    order,
    customerId: null,
    guest: userInfo,
    method,
  };

  const transaction = await transactionService.createTransaction(
    createTransactionDto,
  );
  responseEmitter(req, res, next)(
    httpStatus.CREATED,
    httpStatus[201],
    transaction,
  );
});

exports.getTransactionsByIds = catchAsync(async (req, res, next) => {
  const { _id: userId } = getAuthenticatedUser(req);
  const transactions = await transactionService.getTransactionsByUser(userId);
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], transactions);
});

exports.updateTransaction = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  const updateTransactionDto = pick(req.body, ['name']);
  const transaction = await transactionService.updateTransactionById(
    transactionId,
    updateTransactionDto,
  );
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], transaction);
});
