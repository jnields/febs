// Local webpack overrides.
const path = require('path');

const projectPath = process.cwd();

const packageName = require(path.join(projectPath, '/package.json')).name;

module.exports = {

  // entry point
  entry: {
    // 'main-js': './test/fixtures/src/main-riot.js',
    app: path.resolve(__dirname, 'templates/entry.js'),
    // 'main-css': '../core-css-build/test/fixtures/src/main.less',
  },

  output: {
    path: path.resolve(projectPath, 'dist', packageName),
    filename: '[name].bundle.js',
  },
};
