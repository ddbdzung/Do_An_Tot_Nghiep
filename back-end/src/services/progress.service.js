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
 * }} filter
 * @returns {Promise<Progress[]> | null} Return progresses
 */
exports.getProgresses = async filter => {
  if (_.isEmpty(filter)) {
    throw new Error('Filter is empty');
  }

  const { transactionId, userIds, status } = filter;
  if (!transactionId && _.isEmpty(userIds) && !status) {
    throw new Error('Filter is empty');
  }

  if (
    Array.isArray(userIds) &&
    userIds.some(userId => !Mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error('Invalid userId');
  }

  if (transactionId && !Mongoose.isValidObjectId(transactionId)) {
    throw new Error('Invalid transactionId');
  }

  if (!_.isEmpty(userIds) && transactionId) {
    throw new Error('Cannot filter by both userId and transactionId');
  }

  if (status && !Object.values(PROGRESS_STATUS).includes(status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid status');
  }

  const filterObj = {};
  if (transactionId) {
    filterObj.transaction = transactionId;
  } else if (!_.isEmpty(userIds)) {
    filterObj.workers = {
      $in: userIds,
    };
  }
  if (status) {
    filterObj.status = status;
  }

  const progresses = await Progress.find(filterObj);
  return progresses;
};
