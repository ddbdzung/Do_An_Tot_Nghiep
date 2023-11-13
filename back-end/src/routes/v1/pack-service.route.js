const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { permission } = require('../../config/permission');
const { packServiceValidation } = require('../../validations');
const { packServiceController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(
    auth(permission.PACK_SERVICE.GET_PACK_SERVICES),
    validate(packServiceValidation.getPackServices),
    packServiceController.getPackServices,
  )
  .post(
    auth(permission.PACK_SERVICE.CREATE_PACK_SERVICE),
    validate(packServiceValidation.createPackService),
    packServiceController.createPackService,
  );

router
  .route('/:packServiceId')
  .patch(
    auth(permission.PACK_SERVICE.UPDATE_PACK_SERVICE),
    validate(packServiceValidation.updatePackService),
    packServiceController.updatePackService,
  )
  .delete(
    auth(permission.PACK_SERVICE.DELETE_PACK_SERVICE),
    validate(packServiceValidation.deletePackService),
    packServiceController.deletePackService,
  );

module.exports = router;
