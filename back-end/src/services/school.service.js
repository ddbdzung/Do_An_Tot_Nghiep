const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { School } = require('../models');

/**
 * Create a transaction
 * @param {Object} schoolBody
 * @returns {Promise<School>}
 */
const createSchool = async schoolBody => {
  const metadata = {
    name: schoolBody.name,
    gradeType: schoolBody.gradeType,
    province: schoolBody.province,
    district: schoolBody?.district,
  };
  return School.create(
    new School({
      metadata,
    }),
  );
};

const querySchools = async (filter, options) => {
  const schools = await School.paginate(filter, options);
  return schools;
};

const getSchoolById = async id => {
  return School.findById(id);
};

module.exports = {
  createSchool,
  querySchools,
  getSchoolById,
};
