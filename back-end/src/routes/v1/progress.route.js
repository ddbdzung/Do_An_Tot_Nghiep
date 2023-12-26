const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { permission } = require('../../config/permission');
const { progressController } = require('../../controllers');
const { cartValidation } = require('../../validations');

const router = express.Router();

router.route('/test').get(progressController.getProgresses);

module.exports = router;
