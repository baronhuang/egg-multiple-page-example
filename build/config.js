/**
 *  webpack基本参数配置
 */

const path = require('path');
const packageJson = require('../package.json');

const devMode = process.env.NODE_ENV !== 'production';
const config = {
  /* 是否为开发模式 */
  devMode,
  /**
   * 静态资源域名，构建时可以根据传入的WEBPACK_HOST参数来修改，适合每个环境不同域名的情况
   * 如果需要单独放到文件服务器或者cdn上，跟网站的域名需要不同时，才需要配置
   * 本地开发环境下不能配置域名，否则热更新无效
   */
  host: process.env.WEBPACK_HOST || devMode ? '' : 'http://local.example.com',
  /* egg项目启动端口 */
  eggPort: 7100,
  /* webpack启动端口 */
  webpackPort: 7200,
  /* build的本地路径 */
  outputPath: devMode ? path.resolve(__dirname, '../static') : path.resolve(__dirname, '../dist/static'),
  /* 静态文件的相对路径，相对于outputPath */
  publicPath: '/static/',
  /* 是否要热更新 */
  reload: true,
  /* html修改以后是否刷新浏览器，不想打开可以设置为false */
  reloadBrowser: true,
  /* webpack打包缓存目录 */
  cacheDir: `/_webpack_cache/${packageJson.name}/`
};

/* 若有提供host，需要把host放到publicPath之前 */
if (config.host) {
  config.publicPath = `${config.host}${config.publicPath}`;
}

// 如果检测到有WEBPACK_RELOAD
if (process.env.WEBPACK_RELOAD === 'true') {
  config.reload = true;
} else if (process.env.WEBPACK_RELOAD === 'false') {
  config.reload = false;
}

module.exports = config;
