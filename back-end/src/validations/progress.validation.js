const Joi = require('joi');
const { PROGRESS_STATUS } = require('../common/constants.common');
const { objectId } = require('./custom.validation');

exports.getProgresses = {
  query: Joi.object({
    transactionId: Joi.string().custom(objectId),
    customerId: Joi.string().custom(objectId),
    status: Joi.string().valid(...Object.values(PROGRESS_STATUS)),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
  }),
};

exports.updateProgress = {
  params: Joi.object({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object({
    status: Joi.string().valid(...Object.values(PROGRESS_STATUS)),
    workers: Joi.array().items(Joi.string().custom(objectId)),
    schedule: Joi.date(),
    note: Joi.string(),
  }),
};

exports.getProgressById = {
  params: Joi.object({
    id: Joi.string().custom(objectId),
  }),
};
