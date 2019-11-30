/**
 * 开发环境用来监听文件的服务器
 */

const config = require('./config');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./webpack.dev.conf');
const CompileHtmlPlugin = require('./plugins/compile-html-plugin');
const port = config.webpackPort;
const app = express();

/* 热更新 */
if (config.reload) {
  // 给入口entry文件添加热更新监听
  Object.keys(webpackConfig.entry).forEach(function (name) {
    // html文件不需要进行热更新
    if (!/\.(html|nj)$/.test(name)) {
      webpackConfig.entry[name] = ['./build/hotReload'].concat(webpackConfig.entry[name]);
    }
  });
}

const compiler = webpack(webpackConfig);
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: config.publicPath,
  logLevel: 'silent' // webpack4用这个
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: console.log,
  /* 这里path必须要跟hot-reload里的一致，不然无法热更新 */
  path: config.publicPath + '_hmr'
});

// 是否刷新浏览器
if (config.reloadBrowser) {
  // html编译完成时，通知hotMiddleware刷新浏览器
  new CompileHtmlPlugin({ hotMiddleware }).apply(compiler);
} else {
  new CompileHtmlPlugin().apply(compiler);
}

app.use(devMiddleware);
app.use(hotMiddleware);

// express上需要设置的静态目录
app.use(config.publicPath, express.static('./static'));
app.use(config.publicPath + 'libs/', express.static('./src/libs'));
app.use(config.publicPath + 'assets/', express.static('./src/assets'));

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + 'http://localhost:' + port + '\n');
});

app.listen(port);
