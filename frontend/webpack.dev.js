import Webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import dotenv from 'dotenv';
dotenv.config();

const nodeModulesPath = path.resolve(import.meta.dirname, 'node_modules');
const buildPath = path.resolve(import.meta.dirname, 'public', 'build');
const mainPath = path.resolve(import.meta.dirname, 'src', 'main/index.js');
const adminPath = path.resolve(import.meta.dirname, 'src', 'admin/index.js');

const webpackConfig = {
  mode: 'development',
  performance: {
    hints: false,
  },
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
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: [nodeModulesPath],
      options: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
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
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.DefinePlugin({
      _CONFIG_SOURCE: '"Hardcoded"',
      _API_BASE: 'API_BASE' in process.env ? JSON.stringify(process.env.API_BASE) : '\'http://localhost:8080\'',
      _KEYCLOAK_CLIENT_ID: 'KEYCLOAK_CLIENT_ID' in process.env ? JSON.stringify(process.env.KEYCLOAK_CLIENT_ID) : '\'nmp\'',
      _KEYCLOAK_URL: 'KEYCLOAK_URL' in process.env ? JSON.stringify(process.env.KEYCLOAK_URL) : '\'http://localhost:8085/auth/\'',
      _KEYCLOAK_REALM: 'KEYCLOAK_REALM' in process.env ? JSON.stringify(process.env.KEYCLOAK_REALM) : '\'msa\'',
    }),
    new HtmlWebpackPlugin({
      chunks: ['mainBundle'],
      filename: 'generated_index.html',
      templateParameters: {
        googleAnalyticsEnabled: false,
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
