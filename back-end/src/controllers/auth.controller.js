const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require('../services');
const responseEmitter = require('../utils/responseEmitter');

const register = catchAsync(async (req, res, next) => {
  const user = await userService.createUser(req.body);
  const tokens = tokenService.generateAuthTokens(user);
  const permissions = await userService.getPermissions(user.roleId, {
    lean: true,
  });
  const {
    _doc: { isPasswordChange, password, __v, roleId, ...plainUser },
    ...rest
  } = user;

  responseEmitter(req, res, next)(
    httpStatus.CREATED,
    'User registered successfully',
    {
      user: Object.assign(plainUser, { permissions }),
      tokens,
    },
  );
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = tokenService.generateAuthTokens(user);

  const {
    password: _,
    roleId,
    isPasswordChange,
    __v,
    ...userObj
  } = user.toObject();
  const permissions = await userService.getPermissions(roleId, {
    lean: true,
  });

  responseEmitter(req, res, next)(
    httpStatus.OK,
    'User logged in successfully',
    {
      user: Object.assign(userObj, { permissions }),
      tokens,
    },
  );
});

const logout = catchAsync(async (req, res, next) => {
  await authService.logout(req.body.refreshToken);
  responseEmitter(req, res, next)(httpStatus.NO_CONTENT, 'Logout successfully');
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email,
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
