const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { permission } = require('../../config/permission');
const { cartController } = require('../../controllers');
const { cartValidation } = require('../../validations');

const router = express.Router();

router
  .route('/add-to-cart')
  .patch(
    auth([permission.CART.UPDATE_CART, permission.CART.CREATE_CART]),
    validate(cartValidation.addToCart),
    cartController.addToCart,
  );

router
  .route('/:userId')
  .get(
    auth(permission.CART.GET_CART),
    validate(cartValidation.getCart),
    cartController.getCart,
  );

router
  .route('/item/:productId')
  .delete(
    auth(permission.CART.DELETE_CART),
    validate(cartValidation.removeProductFromCart),
    cartController.removeProductFromCart,
  );

module.exports = router;
