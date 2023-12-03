const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { permission } = require('../../config/permission');
const { categoryController } = require('../../controllers');
const { categoryValidation } = require('../../validations');

const router = express.Router();

router
  .route('/a')
  .get(
    auth(permission.CATEGORY.GET_CATEGORIES),
    validate(categoryValidation.getCategories),
    categoryController.getCategories,
  )
  .post(
    auth(permission.CATEGORY.CREATE_CATEGORY),
    validate(categoryValidation.createCategory),
    categoryController.createCategory,
  );

router
  .route('/a/:categoryId')
  .get(
    auth(permission.CATEGORY.GET_CATEGORY),
    validate(categoryValidation.getCategory),
    categoryController.getCategory,
  )
  .patch(
    auth(permission.CATEGORY.UPDATE_CATEGORY),
    validate(categoryValidation.updateCategory),
    categoryController.updateCategory,
  )
  .delete(
    auth(permission.CATEGORY.DELETE_CATEGORY),
    validate(categoryValidation.softDeleteCategory),
    categoryController.softDeleteCategory,
  );

module.exports = router;
