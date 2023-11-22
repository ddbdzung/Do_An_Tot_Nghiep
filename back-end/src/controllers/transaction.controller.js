const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { transactionService } = require('../services');
const responseEmitter = require('../utils/responseEmitter');

exports.getTransactions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await transactionService.queryTransactions(filter, options);
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], result);
});

exports.createTransaction = catchAsync(async (req, res) => {
  const customerId = req.user._id;
  const { packServiceId } = req.params;
  const createTransactionDto = Object.assign(
    {
      customerId,
      packServiceId,
    },
    pick(req.body, ['products']),
  );

  const transaction = await transactionService.createTransaction(
    createTransactionDto,
  );
  responseEmitter(req, res, next)(
    httpStatus.CREATED,
    httpStatus[201],
    transaction,
  );
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
