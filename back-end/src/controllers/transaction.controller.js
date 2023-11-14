const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { transactionService } = require('../services');
const { ResponsePayloadBuilder } = require('../common/response-payload');

exports.getTransactions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await transactionService.queryTransactions(filter, options);
  res
    .status(200)
    .json(
      new ResponsePayloadBuilder()
        .setCode(httpStatus.OK)
        .setMessage(httpStatus[200])
        .setResult(result)
        .build(),
    );
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
  return res
    .status(httpStatus.CREATED)
    .json(
      new ResponsePayloadBuilder()
        .setCode(httpStatus.CREATED)
        .setMessage(httpStatus[201])
        .setResult(transaction)
        .build(),
    );
});

exports.updateTransaction = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  const updateTransactionDto = pick(req.body, ['name']);
  const transaction = await transactionService.updateTransactionById(
    transactionId,
    updateTransactionDto,
  );
  res
    .status(httpStatus.OK)
    .json(
      new ResponsePayloadBuilder()
        .setCode(httpStatus.OK)
        .setMessage(httpStatus[200])
        .setResult(transaction)
        .build(),
    );
});
