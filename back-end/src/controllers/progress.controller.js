const httpStatus = require('http-status');
const { progressService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const responseEmitter = require('../utils/responseEmitter');

exports.getProgresses = catchAsync(async (req, res, next) => {
  const progresses = await progressService.getProgresses({
    status: 'on_going',
  });
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], progresses);
});
