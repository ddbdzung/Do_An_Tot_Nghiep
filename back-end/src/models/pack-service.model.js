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
  }, {
    timestamps: false,
    id: false,
  },
)

const packServiceDetailSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    amount: {
      type: Number,
      required: true,
    },
  }, {
    timestamps: false,
    id: false,
  },
)

const packServiceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: [packServiceDetailSchema],
    images: [imageCollectionSchema],
    description: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);


packServiceSchema.plugin(toJSON);
packServiceSchema.plugin(paginate);

/**
 * @typedef PackService
 */
const PackService = mongoose.model('PackService', packServiceSchema);

module.exports = PackService;
