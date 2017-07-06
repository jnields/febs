// Example usage - Webpack dev server
const path = require('path');
const febs = require('../../src/index');

febs.devServer({
  confPath: path.resolve(__dirname, '../../src/webpack.overrides.conf.js'),
});
