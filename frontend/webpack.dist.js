import Webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import dotenv from 'dotenv';
dotenv.config();

const nodeModulesPath = path.resolve(import.meta.dirname, 'node_modules');
const buildPath = path.resolve(import.meta.dirname, 'public', 'build');
const mainPath = path.resolve(import.meta.dirname, 'src', 'main/index.js');
const adminPath = path.resolve(import.meta.dirname, 'src', 'admin/index.js');

const webpackConfig = {
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
    moduleIds: 'deterministic',
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
      options: {
        presets: ['@babel/preset-react', ['@babel/preset-env', { targets: 'last 2 versions, >3%, ie 11' }]],
        plugins: ['@babel/plugin-proposal-object-rest-spread'],
      },
    }, {
      test: /\.(s?)css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          url: false,
        },
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
      ],
    }, {
      test: /\.(otf|eot|svg|ttf|woff|woff2)$/i,
      type: 'asset/inline',
      parser: {
        dataUrlCondition: {
          maxSize: 10000,
        },
      },
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      type: 'asset/resource',
      generator: {
        filename: '[name][ext]'
      },
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
    new CompressionPlugin(),
    new Webpack.DefinePlugin({
      _API_BASE: JSON.stringify(process.env.API_BASE),
      _KEYCLOAK_CLIENT_ID: JSON.stringify(process.env.KEYCLOAK_CLIENT_ID),
      _KEYCLOAK_URL: JSON.stringify(process.env.KEYCLOAK_URL),
      _KEYCLOAK_REALM: JSON.stringify(process.env.KEYCLOAK_REALM),
    }),
    new HtmlWebpackPlugin({
      chunks: ['mainBundle'],
      filename: 'generated_index.html',
      templateParameters: {
        googleAnalyticsEnabled: 'GA_ENABLED' in process.env ? JSON.parse(process.env.GA_ENABLED) : false,
      },
      template: path.resolve(import.meta.dirname, 'templates/main.html'),
    }),
    new HtmlWebpackPlugin({
      chunks: ['adminBundle'],
      filename: 'admin.html',
      template: path.resolve(import.meta.dirname, 'templates/admin.html'),
    }),
  ],
};

export default webpackConfig;
