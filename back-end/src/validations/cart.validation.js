const { objectId } = require('./custom.validation');
const joi = require('joi');

exports.addToCart = {
  body: joi.object().keys({
    productId: joi.string().required().custom(objectId),
    quantity: joi.number().integer().required(),
  }),
};

exports.getCart = {
  params: joi.object().keys({
    userId: joi.string().required().custom(objectId),
  }),
};

exports.updateCart = {
  params: joi.object().keys({
    userId: joi.string().required().custom(objectId),
  }),
  body: joi.object().keys({
    productId: joi.string().required().custom(objectId),
    quantity: joi.number().integer().required().min(1),
  }),
};

exports.removeProductFromCart = {
  params: joi.object().keys({
    productId: joi.string().required().custom(objectId),
  }),
};
