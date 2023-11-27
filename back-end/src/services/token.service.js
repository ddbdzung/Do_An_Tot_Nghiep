const ApiError = require('../utils/ApiError');
const { DateTime } = require('luxon');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { Token } = require('../models');
const config = require('../config/config');
const logger = require('../config/logger');

const { accessTokenLife, accessTokenKey, refreshTokenLife, refreshTokenKey } =
  config.jwt;

const generateToken = (payload, key, options) =>
  jwt.sign(payload, key, options);

/**
 * Create a new session of user
 * @param {string} token refresh token
 * @param {string} id object id of user
 * @returns {Promise<mongoose>}
 */
const createSessionUser = async (token, id) =>
  Token.create({
    token,
    user: id,
  });

const generateAuthTokens = user => {
  const now = DateTime.now().toUnixInteger(); // Epoch time in second
  const accessTokenExpires = accessTokenLife * 60; // In Second
  const refreshTokenExpires = refreshTokenLife * 60 * 60 * 24; // In second
  const id = user?._id || user?.id;
  const { roleId, status } = user;
  const payload = {
    status,
    role: roleId,
    sub: id,
    iat: now, // Epoch time in second
  };
  if (process.env.NODE_ENV === 'test') {
    // Unique token in test env with sync timer
    payload.salt = Math.random();
  }
  const accessToken = generateToken(payload, accessTokenKey, {
    expiresIn: accessTokenExpires,
  });
  const refreshToken = generateToken(payload, refreshTokenKey, {
    expiresIn: refreshTokenExpires,
  });

  return {
    access: {
      token: accessToken,
      expiresAt: now + accessTokenExpires, // Time expires in epoch second
    },
    refresh: {
      token: refreshToken,
      expiresAt: now + refreshTokenExpires, // Time expires in epoch second
    },
  };
};
/**
 * @Returns {string} a validate account token
 */
const generateValAccToken = userId =>
  generateToken({ id: userId }, config.jwt.secret, {
    expiresIn: 5 * 1000 * 60,
  });

/**
 * Return decoded payload or throw API error when token is invalid
 * @param {string} token
 * @param {string} keyType 'access' | 'refresh' | 'validateAccount' | 'default' | 'client' | 'secure'
 * @param {string} msg custom message throw when token is invalid
 * @returns {object|error}
 */
const verifyToken = (token, keyType = 'access', msg = undefined) => {
  let key;
  if (keyType === 'access') {
    key = config.jwt.accessTokenKey;
  } else if (keyType === 'refresh') {
    key = config.jwt.refreshTokenKey;
  } else {
    throw new Error("Type error! Key must be one of 'access' or 'refresh'");
  }

  try {
    const decodedPayload = jwt.verify(token, key);
    return decodedPayload;
  } catch (e) {
    logger.error('Error verify token', e);
    // Invalid token: malformed token
    throw new ApiError(httpStatus.UNAUTHORIZED, msg || httpStatus[401]);
  }
};

const getSessionByToken = async token =>
  Token.findOne({ token }).populate('user');

const getSessionByPreviousToken = async token =>
  Token.findOne({ previousToken: token });

const removeSession = async token => Token.findOneAndRemove({ token });

module.exports = {
  generateAuthTokens,
  generateValAccToken,
  verifyToken,
  getSessionByToken,
  getSessionByPreviousToken,
  removeSession,
  createSessionUser,
};
