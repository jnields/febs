/* eslint-disable global-require, import/no-dynamic-require */
/**
 * Util functions.
 */
const logger = require('./logger');

const getWebpackErrors = (err, stats) => {
  // Container to hold errors and warnings:
  // { fatal: '', compile: '', warnings: ''}
  let fatalErrors = {};
  let compileErrors = {};
  let warnings = {};

  // Fatal errors
  if (err) {
    fatalErrors = {
      fatal: err,
    };
  }

  const info = stats.toJson();

  // Compile errors
  if (stats.hasErrors()) {
    compileErrors = {
      compile: info.errors,
    };
  }

  // Warnings.
  if (stats.hasWarnings()) {
    warnings = {
      warnings: info.warnings,
    };
  }

  if (err || stats.hasErrors() || stats.hasWarnings()) {
    return Object.assign({}, fatalErrors, compileErrors, warnings);
  }
  return false;
};

/**
 * Logs out reported errors.
 * @param {*} errors
 */
const logErrors = (errors) => {
  if (!errors) return;

  // Fatal error (wp)
  if (errors.err) {
    logger.error(errors.err.stack || errors.err);
    if (errors.err.details) {
      logger.error(errors.err.details);
    }
    return;
  }

  // Compile errors (wp)
  if (errors.compile) {
    logger.error(errors.compile[0]);
  }

  // Warnings (wp)
  if (errors.warning) {
    logger.warning(errors.warnings[0]);
  }

  // Non-webpack error.
  logger.error(errors);
};

module.exports = {
  getWebpackErrors,
  logErrors,
};
