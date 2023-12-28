const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const workerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    responsibility: {
      type: String,
      required: true,
      trim: true,
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

workerSchema.virtual('age').get(function () {
  return new Date().getFullYear() - this.dateOfBirth.getFullYear();
});

workerSchema.plugin(toJSON);
workerSchema.plugin(paginate);

/**
 * @typedef Worker
 */
const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;
