const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { permission } = require('../../config/permission');
const { productController } = require('../../controllers');
const { productValidation } = require('../../validations');

const router = express.Router();

router
  .route('/a')
  .get(
    auth(permission.PRODUCT.GET_PRODUCTS),
    validate(productValidation.getProducts),
    productController.getProducts,
  )
  .post(
    auth(permission.PRODUCT.CREATE_PRODUCT),
    validate(productValidation.createProduct),
    productController.createProduct,
  );

router
  .route('/a/:productId')
  .get(
    auth(permission.PRODUCT.GET_PRODUCT),
    validate(productValidation.getProduct),
    productController.getProduct,
  )
  .patch(
    auth(permission.PRODUCT.UPDATE_PRODUCT),
    validate(productValidation.updateProduct),
    productController.updateProduct,
  )
  .delete(
    auth(permission.PRODUCT.DELETE_PRODUCT),
    validate(productValidation.softDeleteProduct),
    productController.softDeleteProduct,
  );

router
  .route('/')
  .get(validate(productValidation.getProducts), productController.getProducts);

module.exports = router;
