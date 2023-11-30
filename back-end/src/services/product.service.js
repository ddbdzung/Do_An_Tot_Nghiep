const ApiError = require('../utils/ApiError');
const { Product } = require('../models/');
const httpStatus = require('http-status');
const { categoryService } = require('../services');
const Mongoose = require('mongoose');

exports.getProductById = async id => {
  const product = await Product.findById(id);
  if (!product || product.deletedAt) {
    return null;
  }

  return product.populateOption('category');
};

exports.queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  const { results, ...rest } = products;
  const resultsWithPopulate = await Promise.all(
    results.map(async product => {
      const productPopulate = await product.populateOption('category');
      return productPopulate;
    }),
  );
  const resultsNotDeleted = resultsWithPopulate.filter(
    product => !product.deletedAt,
  );
  return {
    results: resultsNotDeleted,
    ...rest,
  };
};

exports.createProduct = async createProductDto => {
  const { price, categoryId, ...productDto } = createProductDto;

  const priceBody = {
    lastValue: price,
    history: [
      {
        _id: new Mongoose.Types.ObjectId(),
        value: price,
      },
    ],
  };

  productDto.category = categoryId;
  productDto.price = priceBody;

  const product = await Product.create(productDto);
  return product;
};

exports.updateProductById = async (productId, updateProductDto) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const {
    categoryId,
    price,
    quantity,
    name,
    detail,
    unit,
    brand,
    description,
    image,
  } = updateProductDto;

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

  if (image) {
    // product.image = {};
    console.log('image', image);
  }

  if (price) {
    const lastValue = product.price.lastValue;
    const history = [...product.price.history];
    if (lastValue === price) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Price must be different from last value',
      );
    }

    const oldPrice = {
      value: price,
      createdAt: Date.now(),
    };
    history.push(oldPrice);

    product.price.lastValue = price;
    product.price.history = history;
  }

  product.quantity = quantity || product.quantity;
  product.name = name || product.name;
  product.detail = detail || product.detail;
  product.unit = unit || product.unit;
  product.brand = brand || product.brand;
  product.description = description || product.description;

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
