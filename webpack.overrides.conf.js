// Local webpack overrides.
const path = require('path');

const projectPath = process.cwd();

const packageName = require(path.join(projectPath, '/package.json')).name;

module.exports = {

  // entry point
  entry: {
    app: path.resolve(__dirname, 'templates/entry.js'),
  },

  output: {
    path: path.resolve(projectPath, 'dist', packageName),
    filename: '[name].bundle.js',
  },
};
