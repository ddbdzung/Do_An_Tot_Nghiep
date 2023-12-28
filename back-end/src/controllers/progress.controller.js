const httpStatus = require('http-status');
const { progressService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const responseEmitter = require('../utils/responseEmitter');
const pick = require('../utils/pick');

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
  const updateProgressDto = pick(req.body, [
    'status',
    'workers',
    'note',
    'schedule',
  ]);
  const progress = await progressService.updateProgress(id, updateProgressDto);
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], progress);
});

exports.getProgressById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const progress = await progressService.getProgressById(id);
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], progress);
});
