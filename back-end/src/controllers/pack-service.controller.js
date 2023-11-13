const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { packService } = require('../services');

const getPackServices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await packService.queryPackServices(filter, options);
  res.send(result);
});

const createPackService = catchAsync(async (req, res) => {
  const user = req.user;
  const pack = await packService.createPackService(req.body, user);
  res.status(httpStatus.CREATED).send(pack);
});

const updatePackService = catchAsync(async (req, res) => {
  const user = req.user;
  const pack = await packService.updatePackServiceById(
    req.params.packServiceId,
    user,
    req.body,
  );
  res.send(pack);
});

const deletePackService = catchAsync(async (req, res) => {
  const user = req.user;
  await packService.softDeleteById(req.params.packServiceId, user);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getPackServices,
  createPackService,
  updatePackService,
  deletePackService,
};
