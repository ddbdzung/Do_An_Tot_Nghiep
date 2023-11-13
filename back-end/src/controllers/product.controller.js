const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const { ResponsePayloadBuilder } = require('../common/response-payload');

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts(filter, options);
  res.send(result);
});

const createProduct = catchAsync(async (req, res) => {
  const createProductDto = pick(req.body, [
    'name',
    'detail',
    'unit',
    'brand',
    'categoryId',
    'price',
    'quantity',
  ]);
  const category = await categoryService.getCategoryById(categoryId, {
    lean: true,
  });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const product = await productService.createProduct(createProductDto);
  return res.status(httpStatus.CREATED).send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const updateProductDto = pick(req.body, [
    'price',
    'quantity',
    'name',
    'detail',
    'unit',
    'brand',
    'categoryId',
  ]);
  const product = await productService.updateProductById(
    productId,
    updateProductDto,
  );
  res.send(product);
});

const softDeleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  await productService.softDeleteProductById(productId);
  res
    .status(httpStatus.OK)
    .json(
      new ResponsePayloadBuilder()
        .setCode(httpStatus.OK)
        .setMessage(httpStatus[200])
        .build(),
    );
});

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  softDeleteProduct,
};
