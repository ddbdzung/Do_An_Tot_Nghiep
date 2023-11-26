const httpStatus = require('http-status');
const { Role } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a role
 * @param {Object} roleBody
 * @returns {Promise<role>}
 */
const createrole = async roleBody => {
  const role = await Role.create(roleBody);
  return role;
};

/**
 * Query for roles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryroles = async (filter, options) => {
  const roles = await Role.paginate(filter, options);
  return roles;
};

/**
 * Get role by id
 * @param {ObjectId} id
 * @param {{lean: boolean}} options
 */
const getroleById = async (id, options = { lean: false }) => {
  return Role.findById(id, null, options);
};

/**
 * Update role by id
 * @param {ObjectId} roleId
 * @param {Object} updateBody
 * @returns {Promise<role>}
 */
const updateroleById = async (roleId, updateBody) => {
  const role = await getroleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'role not found');
  }
  if (role.name === 'admin') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'admin role cannot be update');
  }
  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Delete role by id
 * @param {ObjectId} roleId
 * @returns {Promise<role>}
 */
const deleteroleById = async roleId => {
  const role = await getroleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'role not found');
  }
  if (role.name === 'admin' || role.name === 'user') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'admin or user role cannot be delete',
    );
  }
  await role.remove();
  return role;
};

module.exports = {
  createrole,
  queryroles,
  getroleById,
  updateroleById,
  deleteroleById,
};
