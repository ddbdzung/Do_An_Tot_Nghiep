const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const responseEmitter = require('../utils/responseEmitter');

exports.getCategories = catchAsync(async (req, res, next) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await categoryService.queryCategories(filter, options);
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], result);
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const createCategoryDto = pick(req.body, ['name']);
  const category = await categoryService.createCategory(createCategoryDto);
  responseEmitter(req, res, next)(
    httpStatus.CREATED,
    httpStatus[201],
    category,
  );
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const updateCategoryDto = pick(req.body, ['name']);
  const category = await categoryService.updateCategoryById(
    categoryId,
    updateCategoryDto,
  );
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], category);
});

exports.softDeleteCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  await categoryService.softDeleteCategoryById(categoryId);
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200]);
});
