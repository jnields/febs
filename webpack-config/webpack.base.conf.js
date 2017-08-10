const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetTagPlugin = require('asset-tag-frag-webpack-plugin');
const autoprefixer = require('autoprefixer');

const projectPath = process.cwd();

module.exports = {

  entry: {
    app: path.resolve(projectPath, 'src/entry.js'),
    publicPath: '/dist/',
  },

  output: {
    path: path.resolve(projectPath, 'dist'),
    filename: '[name].bundle.js',
  },

  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.vue',
      '.scss',
      '.css',
    ],
  },

  devtool: 'eval-source-map', // internal, cheap, fast

  // Resolve loaders relative to rei-febs (as this will be a dependency of another module.)
  resolveLoader: {
    modules: [path.resolve(__dirname, '../node_modules')],
  },

  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: path.resolve('./.babelcache'),
            presets: [
              [require('babel-preset-env'), {
                targets: {
                  browsers: [
                    'Chrome > 45',
                    'Firefox > 45',
                    'iOS > 7',
                    'Safari > 7',
                    'Explorer > 10',
                    'Edge > 11',
                  ],
                },
              }],
            ],
          },
        },
      },
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        include: path.resolve('.'),
        use: {
          loader: 'eslint-loader',
          options: {
            // cache: true,
            fix: false,
            failOnWarning: false,
            failOnError: false,
            emitError: false,
            emitWarning: false,
          },
        },
      },
      {
        test: /\.(s[ac]|c)ss$/,
        exclude: path.resolve('./node_modules/rei-cedar'),
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              localIdentName: '[name]_[local]__[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'compressed',
              precision: 8,
            },
          },
        ],
      },
      {
        test: /\.tag$/,
        exclude: /node_modules/,
        loader: 'riot-tag-loader',
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
        }),
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          emitFile: false,
        },
      },
    ],
  },

  plugins: [
    // if you want to pass in options, you can do so:
    new ExtractTextPlugin({
      filename: '[name].bundle.css',
    }),

    new AssetTagPlugin({
      test: process.env.FEBS_TEST,
    }),
  ],
};
