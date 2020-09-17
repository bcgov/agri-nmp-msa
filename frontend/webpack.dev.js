const Webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
require('dotenv').config();

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const buildPath = path.resolve(__dirname, 'public', 'build');
const mainPath = path.resolve(__dirname, 'src', 'main/index.js');
const adminPath = path.resolve(__dirname, 'src', 'admin/index.js');

const config = {
  mode: 'development',
  performance: {
    hints: false,
  },
  entry: {
    mainBundle: [
      'webpack/hot/dev-server',
      'react-hot-loader/patch',
      '@babel/polyfill',
      mainPath,
    ],
    adminBundle: [
      'webpack/hot/dev-server',
      'react-hot-loader/patch',
      '@babel/polyfill',
      adminPath,
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
        },
      },
    },
  },
  output: {
    crossOriginLoading: 'anonymous',
    filename: '[name].js',
    path: buildPath,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs', '.gql', '.graphql'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: [nodeModulesPath],
      query: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-object-rest-spread', 'react-hot-loader/babel'],
      },
    }, {
      test: /\.(s?)css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: true,
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
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.DefinePlugin({
      _API_BASE: 'API_BASE' in process.env ? JSON.stringify(process.env.API_BASE) : '\'http://localhost:8080\'',
      _GA_ENABLED: 'GA_ENABLED' in process.env ? JSON.stringify(process.env.GA_ENABLED) : 'false',
      _GA_PROPERTY: 'GA_PROPERTY' in process.env ? JSON.stringify(process.env.GA_PROPERTY) : 'null',
      _KEYCLOAK_CLIENT_ID: 'KEYCLOAK_CLIENT_ID' in process.env ? JSON.stringify(process.env.KEYCLOAK_CLIENT_ID) : '\'nmp\'',
      _KEYCLOAK_URL: 'KEYCLOAK_URL' in process.env ? JSON.stringify(process.env.KEYCLOAK_URL) : '\'http://localhost:8085/auth/\'',
      _KEYCLOAK_REALM: 'KEYCLOAK_REALM' in process.env ? JSON.stringify(process.env.KEYCLOAK_REALM) : '\'msa\'',
    }),
    new HtmlWebpackPlugin({
      chunks: ['mainBundle'],
      filename: 'generated_index.html',
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
