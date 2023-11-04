const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { transactionService, schoolService } = require('../services');

const createTransaction = catchAsync(async (req, res) => {
  const { v } = req.body;
  const createdBy = req.user.id || req.user._id;
  const transaction = await transactionService.createTransaction(v, createdBy);
  res.status(httpStatus.CREATED).json({ transaction });
});

const updateTransactionsWithSchool = catchAsync(async (req, res) => {
  const { transactionIds, schoolId } = req.body;
  const school = await schoolService.getSchoolById(schoolId);
  if (!school) {
    throw new ApiError(httpStatus.NOT_FOUND, 'School not found');
  }

  const [updatedSchool, transactions] =
    await transactionService.addSchoolToTransaction(transactionIds, school);
  res.json({
    transactions,
    school: updatedSchool,
  });
});

module.exports = {
  createTransaction,
  updateTransactionsWithSchool,
};
