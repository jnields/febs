// Production webpack.conf
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {

  devtool: 'source-map', // external

  plugins: [
    new UglifyJsPlugin({
      sourceMap: true,
      compress: true,
    }),
  ],
};
