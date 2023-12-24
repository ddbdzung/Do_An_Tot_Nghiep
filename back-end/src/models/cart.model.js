const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const cartItemSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Product',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
    _id: false,
  },
);

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

/**
 * @typedef Cart
 */
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
