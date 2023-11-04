const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { permission } = require('../../config/permission');
const { transactionController } = require('../../controllers');
const { transactionValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    auth(permission.TRANSACTION.CREATE_TRANSACTION),
    validate(transactionValidation.createTransaction),
    transactionController.createTransaction,
  );

router
  .route('/add-school')
  .patch(
    auth(permission.TRANSACTION.UPDATE_TRANSACTIONS),
    validate(transactionValidation.updateTransactionsWithSchool),
    transactionController.updateTransactionsWithSchool,
  );

module.exports = router;
