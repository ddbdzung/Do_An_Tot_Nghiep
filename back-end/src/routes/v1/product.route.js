// const express = require('express');
// const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// const { permission } = require('../../config/permission');
// const { schoolController } = require('../../controllers');
// const { schoolValidation } = require('../../validations');

// const router = express.Router();

// router
//   .route('/')
//   .get(
//     auth(permission.SCHOOL.GET_SCHOOLS),
//     validate(schoolValidation.getSchools),
//     schoolController.getSchools,
//   )
//   .post(
//     auth(permission.SCHOOL.CREATE_SCHOOL),
//     validate(schoolValidation.createSchool),
//     schoolController.createSchool,
//   );

// module.exports = router;
