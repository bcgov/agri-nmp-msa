const Webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SriPlugin = require('webpack-subresource-integrity');
require('dotenv').config();

const packageJson = require('./package.json');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const buildPath = path.resolve(__dirname, 'public', 'build');
const mainPath = path.resolve(__dirname, 'src', 'index.js');

const config = {
//  mode: 'development',
  entry: {
    bundle: [
      '@babel/polyfill',
      mainPath,
    ],
  },
  optimization: {
    // runtimeChunk: 'single',
    splitChunks: {
      maxInitialRequests: Infinity,
      minSize: 0,
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
          // name: 'vendor',
          // chunks: 'all',
        },
      },
    },
  },
  output: {
    crossOriginLoading: 'anonymous',
    filename: '[name].[contenthash].js',
    path: buildPath,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs', '.gql', '.graphql'],
    alias: {},
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: [nodeModulesPath],
      query: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-object-rest-spread'],
      },
    }, {
      test: /\.(s?)css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: false,
          reloadAll: true,
        },
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true,
        },
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
      ],
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: ['file-loader?name=[name].[ext]'],
    }, {
      test: /\.(otf|eot|svg|ttf|woff|woff2)$/i,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      }],
    }, {
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new Webpack.HashedModuleIdsPlugin(),
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: process.env.NODE_ENV === 'production',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CompressionPlugin(),
    new Webpack.DefinePlugin({
      _API_BASE: 'API_BASE' in process.env ? JSON.stringify(process.env.API_BASE) : '\'http://localhost:8080\'',
      _GA_ENABLED: 'GA_ENABLED' in process.env ? JSON.stringify(process.env.GA_ENABLED) : 'false',
    }),
    new HtmlWebpackPlugin({
      title: 'AGRI NMP MSA',
      chunks: ['bundle'],
      filename: 'generated_index.html',
      // inject: false,
      mobile: true,
      appMountId: 'root',
      links: [
        //css links
      ],
      // eslint-disable-next-line global-require
      template: require('html-webpack-template'),
    }),
  ],
};

module.exports = config;
