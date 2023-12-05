const joi = require('joi');
const { objectId, price, categoryIds } = require('./custom.validation');

exports.getProducts = {
  query: joi.object().keys({
    name: joi.string(),
    role: joi.string(),
    sortBy: joi.string(),
    limit: joi.number().integer(),
    page: joi.number().integer(),
    categoryIds: joi.string().custom(categoryIds),
    price: joi.string().custom(price),
  }),
};

exports.createProduct = {
  body: joi.object().keys({
    name: joi.string().required().trim(),
    description: joi.string().trim(),
    unit: joi.string().trim(),
    brand: joi.string().trim(),
    categoryId: joi.string().required().custom(objectId),
    price: joi.number().required().min(1),
    quantity: joi.number().required().min(0),
    unit: joi.string().trim().required(),
    images: joi.array().items(
      joi.object().keys({
        blob: joi.string().trim(),
        pos: joi.number().integer(),
      }),
    ),
  }),
};

exports.updateProduct = {
  params: joi.object().keys({
    productId: joi.string().required().custom(objectId),
  }),
  body: joi.object().keys({
    price: joi.number().min(1),
    quantity: joi.number().min(0),
    name: joi.string().trim(),
    description: joi.string().trim(),
    unit: joi.string().trim(),
    brand: joi.string().trim(),
    categoryId: joi.string().custom(objectId),
    images: joi.array().items(
      joi.object().keys({
        blob: joi.string().trim(),
        pos: joi.number().integer(),
      }),
    ),
  }),
};

exports.softDeleteProduct = {
  params: joi.object().keys({
    productId: joi.string().required().custom(objectId),
  }),
};

exports.getProduct = {
  params: joi.object().keys({
    productId: joi.string().required().custom(objectId),
  }),
};
