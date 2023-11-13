const ApiError = require('../utils/ApiError');
const { Product } = require('../models/');
const httpStatus = require('http-status');
const { categoryService } = require('../services');
const { priceHistorySchema } = require('../models/product.model');

exports.queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};

exports.createProduct = async createProductDto => {
  const product = await Product.create(createProductDto);
  return product;
};

exports.updateProductById = async (productId, updateProductDto) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const { categoryId, price, quantity, name, detail, unit, brand } =
    updateProductDto;

  if (categoryId) {
    const category = await categoryService.getCategoryById(categoryId, {
      lean: true,
    });
    if (!category) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `Category not found with this id ${categoryId}`,
      );
    }

    product.category = updateProductDto.categoryId;
  }

  if (price) {
    const lastValue = product.price.lastValue;
    const history = [...product.price.history];
    if (product.price.lastValue === price) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Price must be different from last value',
      );
    }

    const oldPrice = new priceHistorySchema({
      value: lastValue,
    });
    history.push(oldPrice);

    product.price.lastValue = price;
    product.price.history = history;
  }

  product.quantity = quantity || product.quantity;
  product.name = name || product.name;
  product.detail = detail || product.detail;
  product.unit = unit || product.unit;
  product.brand = brand || product.brand;

  return product.save();
};

exports.softDeleteProductById = async productId => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  product.deletedAt = Date.now();
  return product.save();
};
