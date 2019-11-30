/**
 * 开发环境webpack配置
 */

process.env.NODE_ENV = 'development';

const config = require('./config');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.base.conf');

/* 如果启用热更新 */
if (config.reload) {
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}
const devWebpackConfig = merge(webpackConfig, {
  mode: 'development',
  output: {
    // 修复HotModuleReplacementPlugin插件问题 https://github.com/webpack/webpack/issues/6642
    globalObject: 'this'
  },
  // cheap-module-eval-source-map is faster for development
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new FriendlyErrorsPlugin()
  ]
});

module.exports = devWebpackConfig;
