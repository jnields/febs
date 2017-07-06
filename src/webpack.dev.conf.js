// Development webpack conf
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {

  entry: {
    app: path.resolve(__dirname, './entry.js'),
    // 'main.css': './src/main.css',
  },

  output: {
    path: path.resolve(__dirname, '../dest'),
    filename: '[name].bundle.js',
  },

  devtool: 'cheap-eval-source-map', // internal, cheap, fast

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
          presets: [
            ['env', {
              targets: {
                browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'],
              },
            }],
          ],
        },
      },
    }, {
      test: /\.tag$/,
      exclude: /node_modules/,
      loader: 'riot-tag-loader',
      query: {
        // set it to true if you are using hmr
        // add here all the other riot-compiler options riotjs.com/guide/compiler/
        // template: 'pug' for example
        hot: false,
      },
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'less-loader'],
      }),
    }],
  },

  devServer: {
    // contentBase: path.join(__dirname, '../test/harness'),
    contentBase: path.join(__dirname, '../dest'),

    // publicPath: path.join(__dirname, '../asretnha'),
    publicPath: '/dest/',
    compress: true,
    port: 9000,
    open: true,
    openPage: '',
  },

  plugins: [
    // if you want to pass in options, you can do so:
    new ExtractTextPlugin({
      filename: '[name].bundle.css',
    }),
  //   new UglifyJsPlugin({
  //     compress: process.env.NODE_ENV === 'prod',
  //   }),
  ],
};
