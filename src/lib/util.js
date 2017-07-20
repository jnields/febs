/* eslint-disable global-require, import/no-dynamic-require */

const logger = require('./logger');
const fs = require('fs-extra');
const R = require('ramda');
const path = require('path');

/**
 * Initialization function to initialize the utility library
 * with the conf passed to Webpack.
 *
 * @param {Object} wpConf The conf passed to Webpack.
 */
const init = function init(wpConf) {
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
   * Creates the snippet of html needed for a built asset.
   * @param {*} assetName The filename of the js/css asset.
   */
  const createAssetTag = (assetName) => {
    const ext = path.extname(assetName);
    if (ext === '.js') {
      return {
        ext,
        tag: `<script src="${assetName}"></script>`,
      };
    }

    if (ext === '.css') {
      return {
        ext,
        tag: `<link rel="stylesheet" type="text/css" href="${assetName}">`,
      };
    }

    // Shouldn't get here.
    throw new Error(`Unexpected asset name: ${assetName}`);
  };


  const isJSorCSS = fileName => path.extname(fileName) === '.js' || path.extname(fileName) === '.css';
  const getWebpackAssets = stats => stats.toJson().assetsByChunkName.app;
  const createJsCSSTags = assets => assets.filter(isJSorCSS).map(createAssetTag);
  const createAssetHTML = R.compose(createJsCSSTags, getWebpackAssets);

  /**
   * Write array of html tags to the dest directory.
   * @param {Array} assetHTMLTags
   */
  const writeHtmlTags = (assetHTMLTags) => {
    assetHTMLTags.forEach((tagMeta) => {
      if (tagMeta.ext === '.js') {
        fs.writeFileSync(path.resolve(wpConf.output.path, 'assets-foot.html'), tagMeta.tag);
      }

      if (tagMeta.ext === '.css') {
        fs.writeFileSync(path.resolve(wpConf.output.path, 'assets-head.html'), tagMeta.tag);
      }
    });
  };

  const writeAssetTags = R.compose(writeHtmlTags, createAssetHTML);

  // Util library API.
  return {
    getWebpackErrors,
    logErrors,
    createAssetHTML,
    writeHtmlTags,
    writeAssetTags,
  };
};

module.exports = init;
