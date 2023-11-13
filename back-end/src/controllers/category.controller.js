const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const { ResponsePayloadBuilder } = require('../common/response-payload');

exports.getCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await categoryService.queryCategories(filter, options);
  res
    .status(httpStatus.OK)
    .json(
      new ResponsePayloadBuilder()
        .setCode(httpStatus.OK)
        .setMessage(httpStatus[200])
        .setResult(result)
        .build(),
    );
});

exports.createCategory = catchAsync(async (req, res) => {
  const createCategoryDto = pick(req.body, ['name']);
  const category = await categoryService.createCategory(createCategoryDto);
  return res
    .status(httpStatus.CREATED)
    .json(
      new ResponsePayloadBuilder()
        .setCode(httpStatus.CREATED)
        .setMessage(httpStatus[201])
        .setResult(category)
        .build(),
    );
});

exports.updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const updateCategoryDto = pick(req.body, ['name']);
  const category = await categoryService.updateCategoryById(
    categoryId,
    updateCategoryDto,
  );
  res
    .status(httpStatus.OK)
    .json(
      new ResponsePayloadBuilder()
        .setCode(httpStatus.OK)
        .setMessage(httpStatus[200])
        .setResult(category)
        .build(),
    );
});

exports.softDeleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  await categoryService.softDeleteCategoryById(categoryId);
  res
    .status(httpStatus.OK)
    .json(
      new ResponsePayloadBuilder()
        .setCode(httpStatus.OK)
        .setMessage(httpStatus[200])
        .build(),
    );
});
