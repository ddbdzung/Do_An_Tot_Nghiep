const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const normalizeDataResponse = data => {
  if (!data) {
    return null;
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (typeof data === 'number') {
    return {
      number: data,
    };
  }

  if (typeof data === 'string') {
    return {
      string: data,
    };
  }

  if (typeof data === 'object') {
    return data;
  }
};

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const successResponse = res => {
  const { statusCode, message, data, meta } = res.locals;
  const response = {
    statusCode,
    message,
  };
  if (data) {
    response.data = normalizeDataResponse(data);
  }
  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

// eslint-disable-next-line no-unused-vars
const responseHandler = (err, req, res, next) => {
  if (res.locals?.statusCode) {
    return successResponse(res);
  }

  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    statusCode: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  responseHandler,
};
