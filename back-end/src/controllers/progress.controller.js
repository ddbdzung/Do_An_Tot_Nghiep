const httpStatus = require('http-status');
const { progressService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const responseEmitter = require('../utils/responseEmitter');

exports.getProgresses = catchAsync(async (req, res, next) => {
  const { transactionId, customerId, status, page, limit } = req.query;
  const progresses = await progressService.getProgresses({
    status,
    transactionId,
    customerId,
    page,
    limit,
  });
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], progresses);
});

exports.updateProgress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const progress = await progressService.updateProgress(id, status);
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], progress);
});
