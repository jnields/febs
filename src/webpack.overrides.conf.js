// Local webpack overrides.
const path = require('path');

module.exports = {

  // entry point
  entry: {
    // 'main-js': './test/fixtures/src/main-riot.js',
    app: path.resolve(__dirname, 'entry.js'),
    // 'main-css': '../core-css-build/test/fixtures/src/main.less',
  },

  output: {
    path: path.resolve(__dirname, '../dest'),
    filename: '[name].bundle.js',
  },
};
