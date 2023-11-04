const httpStatus = require('http-status');
const { SinhVien } = require('../models');
const ApiError = require('../utils/ApiError');
const { Transaction } = require('../classes/transaction');
const { Transaction: TransactionModel } = require('../models');

/**
 * Create a transaction
 * @param {Object} transactionBody
 * @returns {Promise<TransactionModel>}
 */
const createTransaction = async (transactionBody, createdBy) => {
  const transaction = new Transaction(transactionBody).toDocument();
  transaction.createdBy = createdBy;
  return TransactionModel.create(transaction);
};

const addSchoolToTransaction = async (transactionIds, school) => {
  const transactions = await TransactionModel.find({
    _id: { $in: transactionIds },
  }).sort({ 'metadata.createdAt': 1 });
  transactions.forEach(transaction => {
    if (transaction.school) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Transaction already has school',
      );
    }

    school.paymentHistory.push({
      amount: transaction.changes.amount,
      createdAt: transaction.metadata.createdAt,
      currency: transaction.changes.currency,
    });
  });
  const lastTransaction = transactions[transactions.length - 1];
  school.lastPaymentDate = lastTransaction.metadata.createdAt;
  school.lastPaymentAmount = lastTransaction.changes.amount;
  const pSchool = school.save();

  const pTransWithSchool = transactions.map(transaction => {
    transaction.school = school._id;
    return transaction.save();
  });

  return Promise.all([pSchool, ...pTransWithSchool]);
};

/**
 * Query for sinhViens
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySinhViens = async (filter, options) => {
  const sinhViens = await SinhVien.paginate(filter, options);
  return sinhViens;
};

/**
 * Get sinhVien by id
 * @param {ObjectId} id
 * @returns {Promise<SinhVien>}
 */
const getSinhVienById = async id => {
  return SinhVien.findById(id);
};

/**
 * Update sinhVien by id
 * @param {ObjectId} sinhVienId
 * @param {Object} updateBody
 * @returns {Promise<SinhVien>}
 */
const updateSinhVienById = async (sinhVienId, updateBody) => {
  const sinhVien = await getSinhVienById(sinhVienId);
  if (!sinhVien) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SinhVien not found');
  }

  Object.assign(sinhVien, updateBody);
  await sinhVien.save();
  return sinhVien;
};

/**
 * Delete sinhVien by id
 * @param {ObjectId} sinhVienId
 * @returns {Promise<SinhVien>}
 */
const deleteSinhVienById = async sinhVienId => {
  const sinhVien = await getSinhVienById(sinhVienId);
  if (!sinhVien) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SinhVien not found');
  }
  await sinhVien.remove();
  return sinhVien;
};

module.exports = {
  createTransaction,
  addSchoolToTransaction,
  querySinhViens,
  getSinhVienById,
  updateSinhVienById,
  deleteSinhVienById,
};
