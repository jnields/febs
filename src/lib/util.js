/* eslint-disable global-require, import/no-dynamic-require */

const logger = require('./logger');

/**
 * Initialization function to initialize the utility library
 * with the conf passed to Webpack.
 *
 * @param {Object} wpConf The conf passed to Webpack.
 * @param conf.fs The file system.
 * @param conf.wpConf The webpack conf object.
 */
const init = function init() {
  /**
   * Collect the various type of webpack errors
   * @param {*} err
   * @param {*} stats
   */
  const getWebpackErrors = function (err, stats) {
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

  /**
   * Helper to look at intermediate results in compose chain.
   * E.g., R.compose(func1, log, func2)  <-- Logs results from func2.
   */
  // const log = R.tap(console.log);

  // Util library API.
  return {
    getWebpackErrors,
    logErrors,
  };
};

module.exports = init;
