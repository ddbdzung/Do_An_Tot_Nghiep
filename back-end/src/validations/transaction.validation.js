const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTransaction = {
  body: Joi.object().keys({
    v: Joi.string().required(),
  }),
};

const updateTransactionsWithSchool = {
  body: Joi.object().keys({
    transactionIds: Joi.array().min(1).items(Joi.string().custom(objectId)),
    schoolId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createTransaction,
  updateTransactionsWithSchool,
};
