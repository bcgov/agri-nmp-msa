const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const http = require('http');

const webpackConfig = require('./webpack.dev');

const devServerOptions = {
  contentBase: path.join(__dirname, 'public/build'),
  publicPath: '/',
  index: '/generated_index.html',
  disableHostCheck: true,
  historyApiFallback: {
    verbose: true,
    rewrites: [
      { from: /^\/$/, to: '/generated_index.html' },
      { from: /^\/admin/, to: '/admin.html' },
    ],
  },
  port: 5001,
  compress: true,
  public: 'localhost',
  hot: true,
  watchOptions: {
    ignored: ['node_modules'],
    poll: 1500,
  },
};

WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions);
const compiler = Webpack(webpackConfig);
const devServer = new WebpackDevServer(compiler, devServerOptions);

devServer.listen(5001, '0.0.0.0', () => {
});
