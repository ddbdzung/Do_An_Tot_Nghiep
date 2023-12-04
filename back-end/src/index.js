const mongoose = require('mongoose');
const app = require('./app');
const setup = require('./setup');
const config = require('./config/config');
const logger = require('./config/logger');

setup().then();

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, config.host, () => {
    logger.info(`Listening to port ${config.port} on host ${config.host}`);
  });
});
mongoose.set('debug', true);

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = error => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
