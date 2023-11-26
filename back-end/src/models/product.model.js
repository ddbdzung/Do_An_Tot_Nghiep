const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const imageCollectionSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    pos: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: false,
    id: false,
  },
);

const priceHistorySchema = mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    id: false,
  },
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      text: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    images: [imageCollectionSchema],
    description: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      trim: true,
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      lastValue: {
        type: Number,
        required: true,
        min: 0,
      },
      history: [priceHistorySchema],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.methods.populateOption = async function (populate) {
  const productPopulate = await this.populate(populate).execPopulate();
  return productPopulate;
};

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
