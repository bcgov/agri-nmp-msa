const Webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
require('dotenv').config();

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const buildPath = path.resolve(__dirname, 'public', 'build');
const mainPath = path.resolve(__dirname, 'src', 'main/index.js');
const adminPath = path.resolve(__dirname, 'src', 'admin/index.js');

const config = {
  entry: {
    mainBundle: [
      '@babel/polyfill',
      mainPath,
    ],
    adminBundle: [
      '@babel/polyfill',
      adminPath,
    ],
  },
  optimization: {
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
        presets: ['@babel/preset-react', ['@babel/preset-env', { targets: 'last 2 versions, >3%, ie 11' }]],
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
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CompressionPlugin(),
    new Webpack.DefinePlugin({
      _API_BASE: 'API_BASE' in process.env ? JSON.stringify(process.env.API_BASE) : '\'http://localhost:8080\'',
      _KEYCLOAK_CLIENT_ID: 'KEYCLOAK_CLIENT_ID' in process.env ? JSON.stringify(process.env.KEYCLOAK_CLIENT_ID) : '\'nmp\'',
      _KEYCLOAK_URL: 'KEYCLOAK_URL' in process.env ? JSON.stringify(process.env.KEYCLOAK_URL) : '\'http://localhost:8085/auth/\'',
      _KEYCLOAK_REALM: 'KEYCLOAK_REALM' in process.env ? JSON.stringify(process.env.KEYCLOAK_REALM) : '\'msa\'',
    }),
    new HtmlWebpackPlugin({
      chunks: ['mainBundle'],
      filename: 'generated_index.html',
      templateParameters: {
        googleAnalyticsEnabled: 'GA_ENABLED' in process.env ? JSON.parse(process.env.GA_ENABLED) : false,
        googleAnalyticsProperty: 'GA_PROPERTY' in process.env ? process.env.GA_PROPERTY : 'unset',
      },
      template: path.resolve(__dirname, 'templates/main.html'),
    }),
    new HtmlWebpackPlugin({
      chunks: ['adminBundle'],
      filename: 'admin.html',
      template: path.resolve(__dirname, 'templates/admin.html'),
    }),
  ],
};

module.exports = config;
