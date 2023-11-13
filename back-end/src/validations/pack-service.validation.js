const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getPackServices = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createPackService = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    details: Joi.array().items({
      product: Joi.string().required().custom(objectId),
      amount: Joi.number().required(),
    }),
    images: Joi.array().items({
      blob: Joi.string().required().trim(),
      alt: Joi.string().trim(),
      pos: Joi.number().required(),
    }),
  }),
};

const updatePackService = {
  params: Joi.object().keys({
    packServiceId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required().trim(),
      details: Joi.array().items({
        product: Joi.string().required().custom(objectId),
        amount: Joi.number().required(),
      }),
      images: Joi.array().items({
        blob: Joi.string().required().trim(),
        alt: Joi.string().trim(),
        pos: Joi.number().required(),
      }),
    })
    .min(1),
};

const deletePackService = {
  params: Joi.object().keys({
    packServiceId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getPackServices,
  createPackService,
  updatePackService,
  deletePackService,
};
