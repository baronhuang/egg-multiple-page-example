/**
 * 生产环境webpack配置
 */

process.env.NODE_ENV = 'production';

const path = require('path');
const webpackConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('./config');
const utils = require('./utils');

var prdWebpackConfig = merge(webpackConfig, {
  mode: 'production',
  output: {
    filename: 'js/[name].[chunkhash:7].js'
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        // 使用缓存
        cache: `${config.cacheDir}uglifyjs-webpack-plugin`,
        parallel: true, // 多进程
        uglifyOptions: {
          warnings: false,
          // 废弃
          // compress: {
          //   drop_console: true
          // },
          output: {
            comments: false
          }
        }
      })
    ],
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      cacheGroups: {
        // 将第三方模块提取出来，只提取js
        vendor: {
          test: /[\\/](node_modules|libs)[\\/].*\.js$/,
          chunks: 'initial',
          minChunks: 4,
          name: 'vendor',
          priority: 100
        },
        // 自定义的公共代码提取
        common: {
          // 不提取样式
          test: /common((?!\.(css|scss|less)).)+$/,
          chunks: 'initial',
          name: 'common',
          minChunks: 4,
          priority: 90
        }
      }
    }
  },
  plugins: [
    ...utils.initHtmlWebpackPlugin('./src/templates/**/*.{html,nj}'),
    /* manifest.js 直接注入到html中，减少请求 */
    new ScriptExtHtmlWebpackPlugin({
      inline: /manifest.*\.js$/
    }),
    /* 把css都提取到外链文件 */
    new OptimizeCSSPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }]
      },
      canPrint: true
    }),
    // 复制文件
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/libs'),
        to: 'libs',
        ignore: ['.*'],
        debug: 'warning'
      },
      {
        from: path.resolve(__dirname, '../src/assets'),
        to: 'assets',
        ignore: ['.*'],
        debug: 'warning'
      }
    ]),
    // 分析构建后的js，若觉得构建速度慢可以关掉
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      statsFilename: '_bundle_stats.json', // 文件名
      generateStatsFile: true // 是否生成stats.json文件
    }),
    new ProgressBarPlugin()
  ]
});

module.exports = prdWebpackConfig;
