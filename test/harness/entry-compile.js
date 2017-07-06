// Example usage.
const path = require('path');
const febs = require('../../src/index');

// Normal compile function.
febs.compile({
  confPath: path.resolve(__dirname, '../../src/webpack.overrides.conf.js'),
});
