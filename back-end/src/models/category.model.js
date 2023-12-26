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
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      text: true,
    },
    images: [imageCollectionSchema],
    deletedAt: {
      type: Date,
      default: null,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
