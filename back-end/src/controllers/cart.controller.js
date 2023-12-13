const httpStatus = require('http-status');
const getAuthenticatedUser = require('../common/getAuthenticatedUser');
const responseEmitter = require('../utils/responseEmitter');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');

exports.addToCart = catchAsync(async (req, res, next) => {
  const { _id: userId } = getAuthenticatedUser(req);
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(userId, productId, quantity);

  responseEmitter(req, res, next)(httpStatus.OK, httpStatus[200], cart);
});

exports.getCart = catchAsync(async (req, res, next) => {
  const { _id: userId } = getAuthenticatedUser(req);
  responseEmitter(req, res, next)(
    httpStatus.OK,
    httpStatus[200],
    await cartService.getCartByUserId(userId),
  );
});
