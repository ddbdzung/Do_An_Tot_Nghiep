const logger = require('../config/logger');
const Worker = require('../models/worker.model');

async function generateMockWorker() {
  const res = await Worker.findOne();
  if (res) {
    logger.warn('Worker data not empty');
    return;
  }

  try {
    const workers = require('./data/workers.json');
    if (!Array.isArray(workers) || workers.length === 0) {
      logger.warn('Workers empty');
      return;
    }

    await Worker.insertMany(workers);
    logger.info('Worker seeding completed');
  } catch (ex) {
    logger.error('Worker seeding failed', ex);
    throw ex;
  }
}

module.exports = generateMockWorker;
