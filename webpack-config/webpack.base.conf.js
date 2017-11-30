const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetTagPlugin = require('asset-tag-frag-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const autoprefixer = require('autoprefixer');

const projectPath = process.cwd();
const babelPresetEnv = require('babel-preset-env');
const babelPresetES2015Riot = require('babel-preset-es2015-riot');

// eslint-disable-next-line import/no-dynamic-require
const packageName = require(path.join(projectPath, '/package.json')).name;

module.exports = {

  entry: {
    app: path.resolve(projectPath, 'src/entry.js'),
  },

  output: {
    path: path.resolve(projectPath, 'dist', packageName),
    filename: '[name].bundle.js',
    publicPath: '/dist/',
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
    modules: [
      path.resolve(__dirname, '..', 'node_modules'),
      path.resolve(projectPath, 'node_modules'),
    ],
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
              [
                babelPresetEnv, {
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
                },
              ],
              babelPresetES2015Riot,
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
    new ExtractTextPlugin({
      filename: '[name].bundle.css',
    }),

    new AssetTagPlugin({
      test: process.env.FEBS_TEST,
    }),

    new ManifestPlugin(),
  ],
};
