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
      'webpack/hot/dev-server',
      'react-hot-loader/patch',
      '@babel/polyfill',
      mainPath,
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
  devServer: {
    historyApiFallback: true,
  },
  devtool: 'source-map',
  plugins: [
    // new SriPlugin({
    //   hashFuncNames: ['sha256', 'sha384'],
    //   enabled: process.env.NODE_ENV === 'production',
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.DefinePlugin({
      _API_BASE: 'API_BASE' in process.env ? JSON.stringify(process.env.API_BASE) : '\'http://localhost:8080\'',
      _GA_ENABLED: 'GA_ENABLED' in process.env ? JSON.stringify(process.env.GA_ENABLED) : 'false',
    }),
    new HtmlWebpackPlugin({
      title: 'AGRI NMP MSA',
      chunks: ['bundle', 'vendor'],
      filename: 'generated_index.html',
      inject: false,
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
