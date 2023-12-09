const httpStatus = require('http-status');
const generator = require('generate-password');
const pick = require('../utils/pick');
const pickSearch = require('../utils/pickSearch');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, emailService } = require('../services');
const { permission } = require('../config/permission');
const responseEmitter = require('../utils/responseEmitter');

const createUser = catchAsync(async (req, res) => {
  req.body.password = generator.generate({
    length: 8,
    numbers: true,
    strict: true,
  });
  const user = await userService.createUser(req.body);
  await emailService.sendPasswordEmailWhenCreate(
    user.email,
    user,
    req.body.password,
  );
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['status', 'role']);
  filter = { ...filter, ...pickSearch(req.query, ['name']) };
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(
    req.params.userId,
    req.query.populate,
  );
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const { email, roleId } = req.body;
  if (email || roleId) {
    const userPermission = req.user.roleId.permission || [];
    if (!userPermission.includes(permission.USER.MANAGE_USER)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
  }
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!(await req.user.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'old password is not match');
  }
  const user = await userService.updateUserById(req.user.id, {
    password: newPassword,
  });
  user.isPasswordChange = true;
  await user.save();
  res.send(user);
});

const setPassword = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.body.userId, {
    password: req.body.password,
  });
  res.send(user);
});

const getMe = catchAsync(async (req, res, next) => {
  const { _id: id } = req.user;
  const { populate } = req.query;
  const user = await userService.getUserById(id, populate);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], user);
});

const updateMe = catchAsync(async (req, res, next) => {
  const { _id: id } = req.user;
  const updateMeBody = pick(req.body, [
    'name',
    'address',
    'gender',
    'dateOfBirth',
    'phoneNumber',
  ]);
  console.log('updateMeBody', updateMeBody);
  const user = await userService.updateUserById(id, updateMeBody);
  responseEmitter(req, res, next)(
    httpStatus.OK,
    'Update user successfully',
    user,
  );
});

const toggleFavouriteProducts = catchAsync(async (req, res, next) => {
  const { _id: id } = req.user;
  const { productId } = req.params;
  const { productIds } = req.body;
  if (productId) {
    productIds.push(productId);
  }
  const user = await userService.toggleFavouriteProducts(id, productIds);
  responseEmitter(req, res, next)(
    httpStatus.OK,
    'Add favourite products successfully',
    user,
  );
});

const getFavouriteProducts = catchAsync(async (req, res, next) => {
  const { _id: id } = req.user;
  const user = await userService.getFavouriteProducts(id);
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], user);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  setPassword,
  getMe,
  updateMe,
  toggleFavouriteProducts,
  getFavouriteProducts,
};
