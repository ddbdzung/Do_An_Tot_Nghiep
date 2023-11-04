const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sinhVienService } = require('../services');

const createSinhVien = catchAsync(async (req, res) => {
  const sinhVien = await sinhVienService.createSinhVien(req.body);
  res.status(httpStatus.CREATED).send(sinhVien);
});

const getSinhViens = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['name', 'role']);
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await sinhVienService.querySinhViens(filter, options);
  res.send(result);
});

const getSinhVien = catchAsync(async (req, res) => {
  const sinhVien = await sinhVienService.getSinhVienById(req.params.sinhVienId);
  if (!sinhVien) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SinhVien not found');
  }
  res.send(sinhVien);
});

const updateSinhVien = catchAsync(async (req, res) => {
  const sinhVien = await sinhVienService.updateSinhVienById(req.params.sinhVienId, req.body);
  res.send(sinhVien);
});

const deleteSinhVien = catchAsync(async (req, res) => {
  await sinhVienService.deleteSinhVienById(req.params.sinhVienId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSinhVien,
  getSinhViens,
  getSinhVien,
  updateSinhVien,
  deleteSinhVien
};
