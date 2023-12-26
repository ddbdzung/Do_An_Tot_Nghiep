const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { PROGRESS_STATUS } = require('../common/constants.common');

const progressSchema = mongoose.Schema(
  {
    workers: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Worker',
      },
    ],
    customer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      default: null,
    },
    transaction: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Transaction',
    },
    status: {
      type: String,
      enum: Object.values(PROGRESS_STATUS),
      default: null,
      index: true,
    },
    schedule: {
      type: Date,
      default: null,
    },
    note: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

progressSchema.plugin(toJSON);
progressSchema.plugin(paginate);

progressSchema.methods.populateOption = async function (populate) {
  const progressPopulate = await this.populate(populate).execPopulate();
  return progressPopulate;
};

/**
 * @typedef Progress
 */
const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
