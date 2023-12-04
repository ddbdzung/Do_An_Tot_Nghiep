const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService, categoryService } = require('../services');
const responseEmitter = require('../utils/responseEmitter');
const getAuthenticatedUser = require('../common/getAuthenticatedUser');

const getProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productService.getProductById(productId);
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], product);
});

const getProducts = catchAsync(async (req, res, next) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
  }

  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts(filter, options);
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], result);
});

const createProduct = catchAsync(async (req, res, next) => {
  const createProductDto = pick(req.body, [
    'name',
    'detail',
    'unit',
    'brand',
    'categoryId',
    'price',
    'quantity',
    'unit',
    'images',
  ]);
  const category = await categoryService.getCategoryById(
    createProductDto.categoryId,
    {
      lean: true,
    },
  );
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const product = await productService.createProduct(createProductDto);
  responseEmitter(req, res, next)(httpStatus.CREATED, httpStatus[201], product);
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const updateProductDto = pick(req.body, [
    'price',
    'quantity',
    'name',
    'detail',
    'unit',
    'brand',
    'categoryId',
    'description',
    'images',
  ]);
  const product = await productService.updateProductById(
    productId,
    updateProductDto,
  );

  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], product);
});

const softDeleteProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productService.softDeleteProductById(productId);
  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], product);
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  softDeleteProduct,
};
