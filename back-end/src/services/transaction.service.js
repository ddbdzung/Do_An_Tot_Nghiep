const httpStatus = require('http-status');
const { SinhVien } = require('../models');
const ApiError = require('../utils/ApiError');
const { Transaction } = require('../models');
const logger = require('../config/logger');
const packService = require('./pack-service.service');

exports.queryTransactions = async (filter, options) => {
  const transactions = await Transaction.paginate(filter, options);
  return transactions;
};

/**
 *
 * @param {{
 *   customerId: string
 *   packServiceId: string
 *   products: [{
 *     product: string
 *     amount: number
 *     price: number
 *   }]
 * }} createTransactionDto
 */
exports.createTransaction = async createTransactionDto => {
  const pack = await packService.getPackServiceById(
    createTransactionDto.packServiceId,
  );
  if (!pack || pack.deletedAt) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PackService not found');
  }

  const { products } = createTransactionDto;
  const transaction = await Transaction.create(createTransactionDto);
  return transaction;
};
