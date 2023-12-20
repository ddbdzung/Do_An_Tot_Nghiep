const mongoose = require('mongoose');
const { toJSON, paginate, findByIdAndPopulate } = require('./plugins');
const {
  TRANSACTION_STATUS,
  TRANSCTION_METHODS,
} = require('../config/constant');

const productTransactionSchema = mongoose.Schema(
  {
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
  },
  {
    timestamps: false,
    id: false,
  },
);

const transactionSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: TRANSACTION_STATUS,
      default: TRANSACTION_STATUS.PREPARING,
    },
    paymentMethod: {
      type: String,
      enum: TRANSCTION_METHODS,
      required: true,
    },
    guest: {
      name: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      address: {
        type: String,
      },
    },
    //To save customer info in present, in case customer update info
    //Used to be official info
    customerInfo: {
      name: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      address: {
        type: String,
      },
    },
    packService: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'PackService',
      default: null,
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
