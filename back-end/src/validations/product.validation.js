const joi = require('joi');
const { objectId } = require('./custom.validation');

exports.getProducts = {
  query: joi.object().keys({
    name: joi.string(),
    role: joi.string(),
    sortBy: joi.string(),
    limit: joi.number().integer(),
    page: joi.number().integer(),
  }),
};

exports.createProduct = {
  body: joi.object().keys({
    name: joi.string().required().trim(),
    detail: joi.string().trim(),
    unit: joi.string().trim(),
    brand: joi.string().trim(),
    categoryId: joi.string().required().custom(objectId),
    price: joi.number().required().min(1),
    quantity: joi.number().required().min(0),
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
    detail: joi.string().trim(),
    unit: joi.string().trim(),
    brand: joi.string().trim(),
    categoryId: joi.string().custom(objectId),
  }),
};

exports.softDeleteProduct = {
  params: joi.object().keys({
    productId: joi.string().required().custom(objectId),
  }),
};
