const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const roleRoute = require('./role.route');
const transactionRoute = require('./transaction.route');
const packServiceRoute = require('./pack-service.route');
// New Route import go here

const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/roles',
    route: roleRoute,
  },
  // New Route go here
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/pack-services',
    route: packServiceRoute,
  },
  {
    path: '/transactions',
    route: transactionRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach(route => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
