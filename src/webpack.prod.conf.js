// Production webpack.conf
const path = require('path');

module.exports = {
  // entry point
  entry: {
    app: './src/entry.js',
  },

  output: {
    path: path.resolve(__dirname, 'dest'),
    filename: '[name].bundle-[hash].js',
  },

  devtool: 'source-map', // external, best, expensive
};
