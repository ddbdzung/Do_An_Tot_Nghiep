const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTransaction = {
  params: Joi.object().keys({
    packServiceId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    products: Joi.array().items(
      Joi.object().keys({
        product: Joi.string().required().custom(objectId),
        amount: Joi.number().integer().required().min(0),
        price: Joi.number().integer().required().min(0),
      }),
    ),
  }),
};

module.exports = {
  createTransaction,
};
