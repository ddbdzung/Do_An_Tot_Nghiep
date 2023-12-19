const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { permission } = require('../../config/permission');
const { transactionController } = require('../../controllers');
const { transactionValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .get(
    auth(permission.TRANSACTION.GET_TRANSACTIONS),
    validate(transactionValidation.getTransactions),
    transactionController.getTransactions,
  )
  .post(
    auth(permission.TRANSACTION.CREATE_TRANSACTION),
    validate(transactionValidation.createTransactionByUser),
    transactionController.createTransactionByUser,
  );

module.exports = router;
