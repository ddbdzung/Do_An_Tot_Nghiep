const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { STATUS } = require('../config/constant');
const { tokenService, userService, roleService } = require('../services');

const auth =
  (...requiredRights) =>
  async (req, _res, next) => {
    const authHeader = req.headers?.authorization;
    try {
      if (!authHeader) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Token is required');
      }

      const token = authHeader.split(' ')[1];
      const { role, status, sub: id } = tokenService.verifyToken(token);

      if (status === STATUS.BANNED) {
        throw new ApiError(httpStatus.FORBIDDEN, httpStatus[403]);
      }

      const user = await userService.getUserById(id);
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401]);
      }

      const roleUser = await roleService.getroleById(role, { lean: true });
      if (!roleUser) {
        throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401]);
      }

      if (requiredRights.length) {
        const requiredRightsClean = requiredRights.flat();
        const userWithPermissions = await user.populateOption('roleId');
        const userRights = userWithPermissions.roleId.permission;
        const hasRequiredRights = requiredRightsClean.every(requiredRight =>
          userRights.includes(requiredRight),
        );

        if (!hasRequiredRights) {
          throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401]);
        }

        const userId = req.params?.userId;
        if (userId && userId !== req.user._id.toString()) {
          throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401]);
        }
      }

      const { _doc } = user;
      req.user = _doc;
      next();
    } catch (err) {
      next(err);
    }
  };
module.exports = auth;
