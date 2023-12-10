const httpStatus = require('http-status');
const { STATUS } = require('../config/constant');
const { User, Role, Product } = require('../models');
const ApiError = require('../utils/ApiError');
const { roles } = require('../config/roles');
const { getProductById } = require('./product.service');

/**
 *
 * @param {string} userId
 * @param {string[]} productIds
 */
const toggleFavouriteProducts = async (userId, productIds) => {
  const areExistingProducts = await Promise.all(
    productIds.map(async productId => {
      const product = await getProductById(productId, {
        lean: true,
      });
      return product;
    }),
  );
  if (areExistingProducts.includes(false)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found');
  }

  const user = await getUserById(userId);
  const favouriteProducts = user.favouriteProducts.map(i => i.toString());
  const favouriteItemsToAdd = productIds.filter(
    id => !favouriteProducts.includes(id),
  );
  const favouriteItemsToKeep = favouriteProducts.filter(
    id => !productIds.includes(id),
  );

  user.favouriteProducts = [...favouriteItemsToKeep, ...favouriteItemsToAdd];
  return user.save();
};

const getFavouriteProducts = async userId => {
  const user = await getUserById(userId);
  const favItems = await Product.find({
    _id: { $in: user.favouriteProducts },
  });
  return favItems;
};

const getPermissions = async (roleId, options = { lean: false }) => {
  const role = await Role.findById(roleId, 'permission', options);
  if (!role) return null;

  return role.permission;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody, role = roles.USER) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const { _id } = await Role.findOne({ name: role }).lean();
  userBody.roleId = _id;
  const user = await User.create(userBody);
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id, populate) => {
  return User.findByIdAndPopulate(id, populate);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async email => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async userId => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.status = STATUS.Delete;
  await user.save();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getPermissions,
  toggleFavouriteProducts,
  getFavouriteProducts,
};
