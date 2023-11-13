const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { PackService } = require('../models');

const createPackService = async (packServiceBody, user) => {
  const { name, description, note, images, details } = packServiceBody;
  return PackService.create({
    name,
    description,
    note,
    images,
    details,
    createdBy: user._id,
  });
};

const queryPackServices = async (filter, options) => {
  const packServices = await PackService.paginate(filter, options);
  return packServices;
};

const updatePackServiceById = async (
  packServiceId,
  user,
  updatePackServiceDto,
) => {
  const packService = await getPackServiceById(packServiceId);
  if (!packService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PackService not found');
  }

  if (packService.createdBy !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  Object.assign(packService, updatePackServiceDto);
  return packService.save();
};

const softDeleteById = async (packId, user) => {
  const packService = await PackService.findOne(packId);
  if (!packService || packService.deletedAt) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PackService not found');
  }

  if (packService.createdBy.toString() === user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  return PackService.findByIdAndUpdate(id, { deletedAt: Date.now() });
};

exports.getPackServiceById = async packServiceId => {
  return PackService.findById(packServiceId);
};

module.exports = {
  createPackService,
  queryPackServices,
  updatePackServiceById,
  softDeleteById,
};
