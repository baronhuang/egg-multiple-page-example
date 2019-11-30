/**
 * 生产环境build
 */

const path = require('path');
const webpack = require('webpack');
const rm = require('rimraf');
const webpackConfig = require('./webpack.prd.conf');

const start = new Date().getTime();
console.log('start building...');

rm(path.resolve(__dirname, '../dist'), err => {
  if (err) throw err;
  webpack(webpackConfig, function (err, stats) {
    if (err) throw err;
    // 只输出错误信息
    process.stdout.write(stats.toString('errors-only'));
    // 输出详细信息
    // process.stdout.write(stats.toString({
    //   colors: true,
    //   modules: false,
    //   children: false,
    //   chunks: false,
    //   chunkGroups: false,
    //   chunkModules: false
    // }) + '\n\n');

    console.log(`finished build! ${(new Date().getTime() - start) / 1000}s`);
  });
});
