const Joi = require('joi');
const { GRADE_TYPE } = require('../config/constant');
const { provinces } = require('../common/vietnam-provinces');
const { objectId } = require('./custom.validation');

const createSchool = {
  body: Joi.object().keys({
    transactionIds: Joi.array().items(Joi.string().custom(objectId)),
    name: Joi.string().required().lowercase().trim(),
    gradeType: Joi.string()
      .valid(...Object.values(GRADE_TYPE))
      .required()
      .lowercase()
      .trim(),
    province: Joi.string()
      .valid(...provinces)
      .required()
      .lowercase()
      .trim(),
    district: Joi.string().lowercase().trim(),
  }),
};

const getSchools = {
  query: Joi.object().keys({
    name: Joi.string().lowercase().trim(),
    gradeType: Joi.string()
      .valid(...Object.values(GRADE_TYPE))
      .lowercase()
      .trim(),
    province: Joi.string()
      .valid(...provinces)
      .lowercase()
      .trim(),
    district: Joi.string().lowercase().trim(),

    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createSchool,
  getSchools,
};
