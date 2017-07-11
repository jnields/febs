// Production webpack.conf
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const cwd = process.cwd();

module.exports = {

  entry: {
    app: path.resolve(cwd, './entry.js'),
    // 'main.css': './src/main.css',
  },

  output: {
    path: path.resolve(cwd, 'dest'),
    filename: '[name].bundle-[hash].js',
  },

  devtool: 'source-map', // external

  // Resolve loaders relative to rei-febs (as this will be a dependency of another module.)
  resolveLoader: {
    modules: [path.resolve(__dirname, '../node_modules')],
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          // presets: [
          //   ['env', {
          //     targets: {
          //       browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'],
          //     },
          //   }],
          // ],
          // presets: [[]],
          presets: [
            [require('babel-preset-env'), {
              targets: {
                browsers: ['ie >= 10'],
              },
            }],
          ],
        },
      },
    }, {
      test: /\.tag$/,
      exclude: /node_modules/,
      loader: 'riot-tag-loader',
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'less-loader'],
      }),
    }],
  },

  plugins: [
    // if you want to pass in options, you can do so:
    new ExtractTextPlugin({
      filename: '[name].bundle-[hash].css',
    }),
    new UglifyJsPlugin({
      sourceMap: true,
      compress: true,
    }),
  ],
};
