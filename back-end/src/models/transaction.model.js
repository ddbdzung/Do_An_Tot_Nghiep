const mongoose = require('mongoose');
const { toJSON, paginate, findByIdAndPopulate } = require('./plugins');

const productTransactionSchema = mongoose.Schema({
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Product',
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
}, {
  timestamps: false,
  id: false,
});

const transactionSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    packService: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'PackService',
    },
    products: [productTransactionSchema],
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);
transactionSchema.plugin(findByIdAndPopulate);

/**
 * @typedef User
 */
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
