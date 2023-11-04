const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/logger');
const User = require('./models/user.model');
const Role = require('./models/role.model');
const { roles, roleRights } = require('./config/roles');
const { GENDER } = require('./config/constant');

const adminUser = {
  name: 'administrator',
  gender: GENDER.Male,
  email: 'isora2002@gmail.com',
  password: config.admin.password,
};

const main = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
  try {
    const isRoleUserExist = await Role.findOne({ name: roles.USER });
    if (!isRoleUserExist) {
      await Role.create({
        name: roles.USER,
        permission: roleRights.get(roles.USER),
      });
    }

    const isRoleAdminExist = await Role.findOne({ name: roles.ADMIN });
    let adminRole = null;
    if (!isRoleAdminExist) {
      adminRole = await Role.create({
        name: roles.ADMIN,
        permission: roleRights.get(roles.ADMIN),
      });
    }

    const isAdminExist = await User.findOne({ email: adminUser.email });
    if (!isAdminExist) {
      adminUser.roleId = adminRole._id;
      await User.create(adminUser);
    }

    const isRoleDirectorExist = await Role.findOne({ name: roles.DIRECTOR });
    if (!isRoleDirectorExist) {
      await Role.create({
        name: roles.DIRECTOR,
        permission: roleRights.get(roles.DIRECTOR),
      });
    }
  } catch (ex) {
    logger.error('cannot create Roles or admin user', ex);
    process.exit(1);
  }
};

module.exports = main;
