const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { TRANSCTION_METHODS } = require('../config/constant');

const createTransactionByUser = {
  body: Joi.object().keys({
    order: Joi.array()
      .items(
        Joi.object().keys({
          productId: Joi.string().required().custom(objectId),
          quantity: Joi.number().min(1).required(),
        }),
      )
      .required()
      .min(1),
    method: Joi.string()
      .valid(
        TRANSCTION_METHODS.BANK_TRANSFER,
        TRANSCTION_METHODS.COD,
        TRANSCTION_METHODS.MOMO,
      )
      .required(),
  }),
};

exports.createTransactionByGuest = {
  body: Joi.object().keys({
    order: Joi.array()
      .items(
        Joi.object().keys({
          productId: Joi.string().required().custom(objectId),
          quantity: Joi.number().min(1).required(),
        }),
      )
      .required()
      .min(1),
    userInfo: Joi.object().keys({
      name: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      address: Joi.string().required(),
    }),
    method: Joi.string()
      .valid(
        TRANSCTION_METHODS.BANK_TRANSFER,
        TRANSCTION_METHODS.COD,
        TRANSCTION_METHODS.MOMO,
      )
      .required(),
  }),
};

exports.getTransactions = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

// {
//   "order": [
//       {
//           "productId": "657ed6074e6777469c7ffa62",
//           "quantity": 1
//       }
//   ],
//   "userInfo": {
//       "name": "Dzung Dang",
//       "phoneNumber": "0987654321",
//       "address": "Nha o Vuon cay su hao"
//   }
// }
module.exports = {
  createTransactionByUser,
};
