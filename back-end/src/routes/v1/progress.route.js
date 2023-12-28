const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { permission } = require('../../config/permission');
const { progressController } = require('../../controllers');
const { progressValidation } = require('../../validations');

const router = express.Router();

router
  .route('/:id')
  .get(
    auth([
      permission.PROGRESS.GET_PROGRESS,
      permission.PROGRESS.MANAGE_PROGRESSES,
    ]),
    validate(progressValidation.getProgressById),
    progressController.getProgressById,
  )
  .put(
    auth([
      permission.PROGRESS.GET_PROGRESS,
      permission.PROGRESS.UPDATE_PROGRESS,
      permission.PROGRESS.MANAGE_PROGRESSES,
    ]),
    validate(progressValidation.updateProgress),
    progressController.updateProgress,
  );

router
  .route('/')
  .get(
    auth([
      permission.PROGRESS.GET_PROGRESSES,
      permission.PROGRESS.MANAGE_PROGRESSES,
    ]),
    validate(progressValidation.getProgresses),
    progressController.getProgresses,
  );

module.exports = router;
