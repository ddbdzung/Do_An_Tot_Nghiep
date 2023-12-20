const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { TRANSCTION_METHODS } = require('../config/constant');

exports.createTransactionByUser = {
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
    paymentMethod: Joi.string()
      .valid(
        TRANSCTION_METHODS.COD,
        TRANSCTION_METHODS.MOMO,
        TRANSCTION_METHODS.PAYPAL,
        TRANSCTION_METHODS.INTERNET_BANKING,
      )
      .required(),
    extraCustomerInfo: Joi.object().keys({
      phoneNumber: Joi.string(),
      address: Joi.string(),
    }),
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
