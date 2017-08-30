/* eslint-disable global-require, import/no-dynamic-require */

const wp = require('webpack');
const logger = require('./lib/logger');
const merge = require('webpack-merge');
const path = require('path');
const { spawn } = require('child_process');
const devServer = require('./lib/dev-server');
const webpackConfigBase = require('./webpack-config/webpack.base.conf');

const projectPath = process.cwd();

let utils;

/**
 * FEBS entry point. The module is initialized with the
 * conf entries.
 *
 * Passed in at run or test time
 * @param conf.env The environment (dev or prod)
 *
 * Passed in at run-time
 * @param conf.command The command received from commander.
 *
 * passed in at test-time
 * @param conf.fs The file system (passed in from unit tests.)

 */
module.exports = function init(conf = {}) {
  // Allow for in-memory fs for testing.
  const fs = conf.fs || require('fs');

  // Get local overrides WP conf.
  const getOverridesConf = (confOverride) => {
    if (confOverride) return confOverride;

    const overridesConfFile = path.resolve(projectPath, './webpack.overrides.conf.js');
    try {
      fs.existsSync(overridesConfFile);
    } catch (e) {
      return {};
    }

    return require(overridesConfFile);
  };

  const getWebpackConfig = (confOverride) => {
    const configsToMerge = [webpackConfigBase];

    // Add development config, if we are in dev
    if (conf.env === 'dev') {
      configsToMerge.push(require('./webpack-config/webpack.dev.conf'));
    }

    // Add production config, if we are building for production
    if (conf.env === 'prod') {
      configsToMerge.push(require('./webpack-config/webpack.prod.conf'));
    }

    // Overrides config.
    configsToMerge.push(getOverridesConf(confOverride));

    // Always replace:
    //   - entry, output
    const wpConf = merge.smartStrategy({
      entry: 'replace',
      output: 'replace',
    })(configsToMerge);

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
      env: conf.env,
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
 * Creates a compiler with config object, runs, handles the various WP errors.
 */
  const compile = () => createCompiler().run(webpackCompileDone);

  const test = function test() {
    let cmd = spawn('mocha', ['--colors', `${conf.command.watch ? '--watch' : 'test'}`]);

    if (conf.command.cover) {
      cmd = spawn('node_modules/istanbul/lib/cli.js', ['cover', 'node_modules/mocha/bin/_mocha', '--', '--colors', 'test']);
    }

    cmd.stdout.on('data', (data) => {
      logger.info(data.toString());
    });

    // It seems istanbul report output goes to stderr.
    cmd.stderr.on('data', (data) => {
      if (conf.command.cover) {
        logger.info(data.toString());
        return;
      }
      logger.error(data.toString());
    });
  };

  /**
   * Start the webpack dev server.
   */
  function startDevServer() {
    const WDS = require('webpack-dev-server');

    const wpConf = getWebpackConfig();

    // Need to update the app entry for webpack-dev-server. This is necessary for
    // the auto page refresh to happen. See: https://github.com/webpack/webpack-dev-server/blob/master/examples/node-api-simple/webpack.config.js
    const pathToWPDSClient = `${path.resolve(__dirname, 'node_modules/webpack-dev-server/client')}?http://localhost:8080`;

    Object.keys(wpConf.entry).forEach((key) => {
      wpConf.entry[key] = [
        pathToWPDSClient,
        path.resolve(projectPath, wpConf.entry[key]),
      ];
    });

    devServer(createCompiler(wpConf), WDS);
  }

  return {
    test,
    compile,
    createCompiler,
    webpackCompileDone,
    startDevServer,
    getWebpackConfig,
  };
};
