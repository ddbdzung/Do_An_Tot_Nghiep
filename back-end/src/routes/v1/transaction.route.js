const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { permission } = require('../../config/permission');
const { transactionController } = require('../../controllers');
const { transactionValidation } = require('../../validations');

const router = express.Router();

router
  .route('/me')
  .get(
    auth(permission.TRANSACTION.GET_TRANSACTIONS),
    validate(transactionValidation.getTransactionsOfMe),
    transactionController.getTransactionsOfMe,
  )
  .post(
    auth(permission.TRANSACTION.CREATE_TRANSACTION),
    validate(transactionValidation.createTransactionByUser),
    transactionController.createTransactionByUser,
  );

router
  .route('/me/:id')
  .get(
    auth(permission.TRANSACTION.GET_TRANSACTION),
    validate(transactionValidation.getTransactionById),
    transactionController.getTransactionOfMeById,
  );

router
  .route('/')
  .get(
    auth([
      permission.TRANSACTION.GET_TRANSACTIONS,
      permission.TRANSACTION.MANAGE_TRANSACTIONS,
    ]),
    validate(transactionValidation.getTransactions),
    transactionController.getTransactions,
  );

router
  .route('/:id')
  .get(
    auth([
      permission.TRANSACTION.GET_TRANSACTION,
      permission.TRANSACTION.MANAGE_TRANSACTIONS,
    ]),
    validate(transactionValidation.getTransactionById),
    transactionController.getTransactionById,
  )
  .patch(
    auth([
      permission.TRANSACTION.UPDATE_TRANSACTIONS,
      permission.TRANSACTION.MANAGE_TRANSACTIONS,
    ]),
    validate(transactionValidation.updateTransaction),
    transactionController.updateTransaction,
  );

module.exports = router;
