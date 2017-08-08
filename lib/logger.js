/**
 * @fileoverview configuration abstraction of the logger.
 */

const winston = require('winston');

const options = {
  colorize: true,
  prettyPrint: true,
  label: 'febs',
};

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(options),
  ],
});

/**
 * Allows the logLevel of the logger to be changed after construction.
 *
 * @param {String('warn','debug','info')} logLevel
 */
logger.setLogLevel = function setLogLevel(logLevel) {
  Object.keys(logger.transports).forEach((transport) => {
    logger.info(`Log Level: ${logLevel}`);
    logger.transports[transport].level = logLevel;
  });
};

module.exports = logger;

