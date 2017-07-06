const wp = require('webpack');
const logger = require('./lib/logger');
const util = require('./lib/util');
const merge = require('webpack-merge');

// Environmental webpack.conf (dev or prod)
const getBaseConf = () => require(`./webpack.${process.env.NODE_ENV}.conf`);

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

  // Overrides config. Override the environmental config defaults.
  let confOverrides;

  if (conf.confPath) {
    confOverrides = require(conf.confPath);
  } else {
    confOverrides = conf; // used for unit testing only.
  }

  // Always replace:
  //   - entry, output
  const wpConf = merge.strategy({
    entry: 'replace',
    output: 'replace',
  })(confBase, confOverrides);

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

// febs api
module.exports = {
  compile,
  createCompiler,
};
