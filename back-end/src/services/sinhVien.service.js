const httpStatus = require('http-status');
const { SinhVien } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a sinhVien
 * @param {Object} sinhVienBody
 * @returns {Promise<SinhVien>}
 */
const createSinhVien = async (sinhVienBody) => {
  const sinhVien = await SinhVien.create(sinhVienBody);
  return sinhVien;
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
const getSinhVienById = async (id) => {
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
const deleteSinhVienById = async (sinhVienId) => {
  const sinhVien = await getSinhVienById(sinhVienId);
  if (!sinhVien) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SinhVien not found');
  }
  await sinhVien.remove();
  return sinhVien;
};

module.exports = {
  createSinhVien,
  querySinhViens,
  getSinhVienById,
  updateSinhVienById,
  deleteSinhVienById
};
