const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { permission } = require('../../config/permission');
const { progressController } = require('../../controllers');
const { progressValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .get(
    auth([
      permission.PROGRESS.GET_PROGRESS,
      permission.PROGRESS.MANAGE_PROGRESSES,
    ]),
    validate(progressValidation.getProgresses),
    progressController.getProgresses,
  );

router
  .route('/:id')
  .put(
    auth([
      permission.PROGRESS.UPDATE_PROGRESS,
      permission.PROGRESS.MANAGE_PROGRESSES,
    ]),
    validate(progressValidation.getProgresses),
    progressController.updateProgress,
  );

module.exports = router;
