// Production webpack.conf
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssProcessor = require('cssnano');
const path = require('path');

const projectPath = process.cwd();

// eslint-disable-next-line import/no-dynamic-require
const packageName = require(path.join(projectPath, '/package.json')).name;

module.exports = {

  output: {
    path: path.resolve(projectPath, 'dist', packageName),
    filename: '[name].bundle-[hash].js',
  },

  devtool: 'source-map', // external

  plugins: [

    new UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),

    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor,
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true,
    }),

  ],
};
