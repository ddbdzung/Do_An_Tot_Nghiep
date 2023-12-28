const productService = require('./product.service');
const { Cart } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const assureOptParam = require('../utils/optionalParams');

/**
 *
 * @param {string} userId
 * @param {string} productId
 * @param {number} quantity
 * @returns Cart
 */
exports.addToCart = async (userId, productId, quantity) => {
  const pCart = Cart.findOne({ user: userId });
  const pProduct = productService.getProductById(productId, {
    lean: true,
  });
  const [cart, product] = await Promise.all([pCart, pProduct]);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  if (quantity > product.quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Quantity not enough');
  }

  let userCart = cart;
  if (!cart) {
    userCart = new Cart({
      user: userId,
      products: [],
    });
    userCart.products.push({
      product: productId,
      amount: quantity,
      updatedAt: Date.now(),
    });

    return userCart.save();
  }
  const productIndex = userCart.products.findIndex(
    item => item.product.toString() === productId.toString(),
  );
  if (productIndex === -1) {
    userCart.products.push({
      product: productId,
      amount: quantity,
      updatedAt: Date.now(),
    });

    return userCart.save();
  }

  if (quantity + userCart.products[productIndex].amount > product.quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Quantity not enough');
  }

  userCart.products[productIndex].amount += quantity;
  userCart.products[productIndex].updatedAt = Date.now();

  return userCart.save();
};

/**
 *
 * @typedef {{lean: boolean}} options
 * @param {string} userId
 * @param {options} options
 */
exports.getCartByUserId = async (userId, options) => {
  const defaultOptions = {
    lean: false,
    populate: '',
  };
  options = assureOptParam(options, defaultOptions);
  const cart = await Cart.findOne({ user: userId }, null, options).populate({
    path: 'products.product',
  });
  if (!cart) {
    return null;
  }

  return cart;
};

exports.removeProductFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const productIndex = cart.products.findIndex(
    item => item.product.toString() === productId.toString(),
  );
  if (productIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  cart.products = cart.products.filter(
    item => item.product.toString() !== productId.toString(),
  );
  return cart.save();
};

exports.removeCartByUserId = async id => {
  const cart = await Cart.deleteOne({
    user: id,
  });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  return cart;
};
