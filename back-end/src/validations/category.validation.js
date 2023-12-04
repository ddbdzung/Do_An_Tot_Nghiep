const joi = require('joi');
const { objectId } = require('./custom.validation');

exports.getCategories = {
  query: joi.object().keys({
    name: joi.string(),
    role: joi.string(),
    sortBy: joi.string(),
    limit: joi.number().integer(),
    page: joi.number().integer(),
  }),
};

exports.createCategory = {
  body: joi.object().keys({
    name: joi.string().required().trim(),
    images: joi.array().items(
      joi.object().keys({
        blob: joi.string().trim(),
        pos: joi.number().integer(),
      }),
    ),
  }),
};

exports.updateCategory = {
  params: joi.object().keys({
    categoryId: joi.string().required().custom(objectId),
  }),
  body: joi.object().keys({
    name: joi.string().trim(),
    images: joi.array().items(
      joi.object().keys({
        blob: joi.string().trim(),
        pos: joi.number().integer(),
      }),
    ),
  }),
};

exports.softDeleteCategory = {
  params: joi.object().keys({
    categoryId: joi.string().required().custom(objectId),
  }),
};

exports.getCategory = {
  params: joi.object().keys({
    categoryId: joi.string().required().custom(objectId),
  }),
};
