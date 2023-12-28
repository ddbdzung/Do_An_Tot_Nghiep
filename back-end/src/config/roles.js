const { permission, permissionArr } = require('./permission');

const roles = {
  ADMIN: 'admin',
  USER: 'user',
  DIRECTOR: 'director',
};

const adminRights = Object.values(permissionArr);

// Set user rights here
const userRights = [
  permission.TRANSACTION.GET_TRANSACTIONS,
  permission.TRANSACTION.GET_TRANSACTION,
  permission.TRANSACTION.CREATE_TRANSACTION,

  permission.CART.UPDATE_CART,
  permission.CART.CREATE_CART,
  permission.CART.GET_CART,
  permission.CART.DELETE_CART,
];

// Set director rights here
const directorRights = [permission.TRANSACTION.GET_TRANSACTIONS];

const roleRights = new Map();
roleRights.set(roles.ADMIN, adminRights);
roleRights.set(roles.USER, userRights);
roleRights.set(roles.DIRECTOR, directorRights);

module.exports = {
  roles,
  roleRights,
};
