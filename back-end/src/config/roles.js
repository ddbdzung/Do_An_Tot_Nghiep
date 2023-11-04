const { permission, permissionArr } = require('./permission');

const roles = {
  ADMIN: 'admin',
  USER: 'user',
  DIRECTOR: 'director',
};

const adminRights = Object.values(permissionArr);

// Set user rights here
const userRights = [];

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
