const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roleService } = require('../services');
const { permission } = require('../config/permission');

const createrole = catchAsync(async (req, res) => {
  const role = await roleService.createrole(req.body);
  res.status(httpStatus.CREATED).send(role);
});

const getroles = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['name', 'role']);
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await roleService.queryroles(filter, options);
  res.send(result);
});

const getrole = catchAsync(async (req, res) => {
  const role = await roleService.getroleById(req.params.roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'role not found');
  }
  res.send(role);
});

const updaterole = catchAsync(async (req, res) => {
  const role = await roleService.updateroleById(req.params.roleId, req.body);
  res.send(role);
});

const deleterole = catchAsync(async (req, res) => {
  await roleService.deleteroleById(req.params.roleId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPermission = catchAsync(async (req, res) => {
  res.json(permission);
});

module.exports = {
  createrole,
  getroles,
  getrole,
  updaterole,
  deleterole,
  getPermission
};
