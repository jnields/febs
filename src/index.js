const wp = require('webpack');
const logger = require('./lib/logger');
const util = require('./lib/util');
const merge = require('webpack-merge');
const fs = require('fs-extra');
const path = require('path');
const { exec, spawn } = require('child_process');

// Environmental WP conf (dev or prod)
const getBaseConf = () => require(`./webpack.${process.env.NODE_ENV}.conf`);

// Get local overrides WP conf.
const getOverridesConf = (conf) => {
  if (conf) return conf;  // unit testing only.

  const cwd = process.cwd();
  const overridesConfFile = path.resolve(cwd, './webpack.overrides.conf.js');
  return fs.pathExistsSync(overridesConfFile) ?
    require(overridesConfFile) : {};
};

/**
 * Create's compiler instance with appropriate environmental
 * webpack.conf merged with the webpack.overrides.
 *
 * @param {Object} conf Webpack conf merged in with the environmental
 *            conf file. Used for testing. If this is present,
 *            merge into env conf, otherwise, merge
 *            the webpack.overrides.js conf into env conf
 *            Return's webpack instance.
 * @return {Object} Webpack compiler instance.
 *
 */
const createCompiler = (conf) => {
  const confBase = getBaseConf();

  // Overrides config.
  const confOverrides = getOverridesConf(conf);

  // Always replace:
  //   - entry, output
  const wpConf = merge.strategy({
    entry: 'replace',
    output: 'replace',
  })(confBase, confOverrides);

  // logger.info('Webpack conf: ', wpConf);

  // Create webpack compiler object with merged config objects.
  return wp(wpConf);
};

/**
 * Compile function.
 *
 * Runs the webpack compilation.
 *
 */
const compile = conf => createCompiler(conf).run((err, stats) => {
  const errors = util.getWebpackErrors(err, stats);

  // Log errors to console
  util.logErrors(errors);

  // Log results to the console.
  logger.info(stats.toString({
    chunks: false,
    colors: true,
  }));
});

/**
 * Main entry point to febs.
 * conf: task, options
 */
const run = (conf) => {
  // Task: Unit tests.
  if (conf.task === 'test') {
    process.env.NODE_ENV = 'dev';
    const cmd = spawn('mocha', ['--colors']);
    cmd.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    cmd.stderr.on('data', (data) => {
      logger.error(data.toString());
    });
  }

  // Task: Dev build.
  // Todo: Use webpack-dev-server API instead of spawning.
  // Note: There were issues with it not refreshing page using the API so, for now, spawning.
  if (conf.task === 'dev' || conf.task === 'prod') {
    process.env.NODE_ENV = conf.task;
    compile();
  }

  // Task: Dev-server build.
  // Todo: Use webpack-dev-server API instead of spawning.
  // Note: There were issues with it not refreshing page using the API so, for now, spawning.
  if (conf.task === 'dev-server') {
    process.env.NODE_ENV = 'dev';
    const cmd = spawn('node', ['../rei-febs/node_modules/webpack-dev-server/bin/webpack-dev-server.js', '--colors', 'true', '--config', '../rei-febs/src/webpack.dev.conf.js']);
    cmd.stdout.on('data', (data) => {
      logger.info(data.toString('utf8'));
    });

    cmd.stderr.on('data', (data) => {
      logger.error(data.toString());
    });
  }
};

// FEBS public API
module.exports = {
  run,
  compile,
  createCompiler,
};
