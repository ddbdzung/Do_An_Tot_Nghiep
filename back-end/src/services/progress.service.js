const Progress = require('../models/progress.model');
const _ = require('lodash');
const Mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { PROGRESS_STATUS } = require('../common/constants.common');
const { TRANSACTION_STATUS } = require('../config/constant');

exports.getProgressById = async id => {
  const progress = await Progress.findById(id)
    .populate('workers')
    .populate('transaction')
    .populate('customer');
  return progress.toObject({
    virtuals: true,
  });
};

/**
 * @param {{
 *  transactionId?: string,
 *  userId?: string[],
 *  status?: string
 *  page?: number,
 *  limit?: number
 * } | undefined} filter
 * @returns {Promise<Progress[]> | null} Return progresses
 */
exports.getProgresses = async filter => {
  const filterObj = {};
  const { transactionId, customerId, status, page, limit } = filter || {};
  if (transactionId) {
    filterObj.transaction = transactionId;
  } else if (customerId) {
    filterObj.customer = customerId;
  }
  if (status) {
    filterObj.status = status;
  }

  const skip = page ? (page - 1) * limit : 0;
  const limitProgress = limit ? limit : 10;

  const progresses = await Progress.find(filterObj)
    .skip(skip)
    .limit(limitProgress)
    .populate('workers')
    .populate('transaction')
    .populate('customer');

  const { toPlainObject, withVirtualProps } = filter;
  if (toPlainObject) {
    return progresses.map(progress => {
      return toPlainObject
        ? progress.toObject({ virtuals: withVirtualProps })
        : progress;
    });
  }

  return progresses;
};

exports.createProgress = async (transactionId, userId) => {
  if (!Mongoose.isValidObjectId(transactionId)) {
    throw new Error('Invalid transactionId');
  }

  if (!Mongoose.isValidObjectId(userId)) {
    throw new Error('Invalid userId');
  }

  return Progress.create({
    transaction: transactionId,
    customer: userId,
  });
};

exports.updateProgress = async (id, progressDto) => {
  const { status, workers, note, schedule } = progressDto;
  const progressUpdateBody = {
    workers: _.isEmpty(workers) ? [] : workers,
  };
  if (status) {
    progressUpdateBody.status = status;
  }
  if (note) {
    progressUpdateBody.note = note;
  }
  if (schedule) {
    progressUpdateBody.schedule = schedule;
  }
  const progress = await Progress.findById(id).populate('transaction');
  const transactionStatus = progress.transaction.status;
  if (transactionStatus === TRANSACTION_STATUS.DONE) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction is done');
  }
  if (transactionStatus === TRANSACTION_STATUS.RETURN) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Transaction is return. Cannot change progress',
    );
  }
  if (transactionStatus === TRANSACTION_STATUS.CANCEL) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction is canceled');
  }
  if (progress.status === PROGRESS_STATUS.DONE) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Progress is done');
  }
  if (progress.status === PROGRESS_STATUS.CANCEL) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Progress is canceled');
  }
  switch (status) {
    case PROGRESS_STATUS.SCHEDULING:
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Cannot change transaction status to scheduling',
      );
    case PROGRESS_STATUS.ON_GOING:
    case PROGRESS_STATUS.IN_PROGRESS:
    case PROGRESS_STATUS.DONE:
      if (transactionStatus !== TRANSACTION_STATUS.DELIVERING) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Cannot change transaction status to on_going. Transaction status must be delivering',
        );
      }
      break;
    default:
      break;
  }

  return Progress.findOneAndUpdate({ _id: id }, progressUpdateBody, {
    new: true,
  });
};
