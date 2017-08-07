/* eslint-disable global-require, import/no-dynamic-require */

const wp = require('webpack');
const logger = require('./lib/logger');
const merge = require('webpack-merge');
const path = require('path');
const { spawn } = require('child_process');
const devServer = require('./dev-server');

let utils;

module.exports = function (conf = {}) {
  // Allow for in-memory fs for testing.
  const fs = conf.fs || require('fs-extra');

  // Environmental WP conf (dev or prod)
  const getBaseConf = () => require(`./webpack.${process.env.NODE_ENV}.conf`);

  // Get local overrides WP conf.
  const getOverridesConf = (confOverride) => {
    if (confOverride) return confOverride;

    const cwd = process.cwd();
    const overridesConfFile = path.resolve(cwd, './webpack.overrides.conf.js');
    return fs.pathExistsSync(overridesConfFile) ?
    require(overridesConfFile) : {};
  };

const getWebpackConfig = (confOverride) => {
    const confBase = getBaseConf();

    // Overrides config.
    const confOverrides = getOverridesConf(confOverride);

    // Always replace:
    //   - entry, output
    const wpConf = merge.strategy({
      entry: 'replace',
      output: 'replace',
    })(confBase, confOverrides);

    return wpConf;
};

/**
 * Create's compiler instance with appropriate environmental
 * webpack.conf merged with the webpack.overrides.
 *
 * @param {Object} conf Webpack conf merged in with the environmental
 *            conf file. Used for testing. If this is present,
 *            merge it into env conf, otherwise, merge
 *            the webpack.overrides.js conf into env conf
 *            Return's webpack instance.
 * @return {Object}
 *
 */
  const createCompiler = (confOverride) => {

    const wpConf = getWebpackConfig(confOverride);

    // Configure utility functions with the final webpack conf.
    utils = require('./lib/util')({
      wpConf,
      fs,
    });

    // Create webpack compiler object with merged config objects.
    return wp(wpConf);
  };

/**
 * The Webpack run callback.
 * @param {*} err
 * @param {*} stats
 */
  const webpackCompileDone = (err, stats) => {
    const errors = utils.getWebpackErrors(err, stats);

    // Log errors to console
    if (!process.env.FEBS_TEST) {
      utils.logErrors(errors);
    }

    // Write asset tags to fs.
    // utils.writeAssetTags(stats);

    // Log results to the console.
    if (!process.env.FEBS_TEST) {
      logger.info(stats.toString({
        chunks: false,
        colors: true,
      }));
    }
  };


/**
 * Webpack compile function.
 *
 * Creates a compiler with config object, runs, handles the various WP errors.
 *
 * @param {Object} conf Webpack config object. This conf object will be merged in
 * with the environmental config object.
 */
  const compile = confOverride => createCompiler(confOverride).run(webpackCompileDone);

/**
 * The main entry point to febs.
 * @param {*} conf Object with tasks and options properties.
 */
  const run = (confApp) => {
    // Task: Unit tests.
    if (confApp.task === 'test') {
    // process.env.NODE_ENV = 'dev';
      const cmd = spawn('mocha', ['--colors']);
      cmd.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      cmd.stderr.on('data', (data) => {
        logger.error(data.toString());
      });
    }

  // Task: Dev and prod builds.
    if (confApp.task === 'dev' || confApp.task === 'prod') {
      process.env.NODE_ENV = confApp.task;

    // Initialize with fs.
      compile();
    }

    // Task: Dev-server build.
    if (confApp.task === 'dev-server') {
      process.env.NODE_ENV = 'dev';

      const wpConf = getWebpackConfig();

      // Need to update the app entry for webpack-dev-server. This is necessary for
      // the auto page refresh to happen. See: https://github.com/webpack/webpack-dev-server/blob/master/examples/node-api-simple/webpack.config.js
      const pathToWPDSClient = `${path.resolve(__dirname, '../node_modules/webpack-dev-server/client')}?http://localhost:8080`;

      for (let key in wpConf.entry) {
        wpConf.entry[key] = [
            pathToWPDSClient,
            path.resolve(process.cwd(), wpConf.entry[key]),
        ];
      }

      devServer(createCompiler(wpConf));
    }
  };

  return {
    run,
    compile,
    createCompiler,
    webpackCompileDone,
  };
};
