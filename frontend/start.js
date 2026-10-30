import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import path from 'path';
import webpackConfig from './webpack.dev.js';

const devServerOptions = {
  static: [
    {
      directory: path.join(import.meta.dirname, 'public/build'),
      publicPath: '/',
      watch: {
        ignored: ['node_modules'],
        poll: 1500,
      },
    },
    {
      directory: path.join(import.meta.dirname, 'assets'),
      publicPath: '/',
      watch: {
        ignored: ['node_modules'],
        poll: 1500,
      },
    },
  ],
  devMiddleware: {
    index: '/generated_index.html',
  },
  allowedHosts: 'all',
  historyApiFallback: {
    verbose: true,
    rewrites: [
      { from: /^\/$/, to: '/generated_index.html' },
      { from: /^\/admin/, to: '/admin.html' },
    ],
  },
  host: '0.0.0.0',
  port: 5001,
  compress: true,
  client: {
    webSocketURL: 'ws://localhost/ws',
  },
};

const compiler = Webpack(webpackConfig);
const devServer = new WebpackDevServer(devServerOptions, compiler);

await devServer.start();