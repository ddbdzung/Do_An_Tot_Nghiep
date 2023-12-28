const Progress = require('../models/progress.model');
const _ = require('lodash');
const ApiError = require('../utils/ApiError');
const Mongoose = require('mongoose');
const { PROGRESS_STATUS } = require('../common/constants.common');
const httpStatus = require('http-status');

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
    .populate('workers');
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

exports.updateProgress = async progressDto => {
  const { id, status, workers } = progressDto;
  const worker = workers ? workers : [];

  const progress = await Progress.findOneAndUpdate(
    { _id: id },
    { status, worker },
    { new: true },
  );
  return progress;
};
