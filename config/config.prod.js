/**
 * 生产环境配置
 */

const path = require('path');
module.exports = (appInfo) => {
  const config = {};

  config.view = {
    root: [
      /* 自定义目录 */
      path.join(__dirname, '../dist/templates')
    ].join(',')
  };

  /* 开启静态目录 */
  config.static = {
    // maxAge: 31536000,
    prefix: '/static',
    dir: path.join(__dirname, '../dist/static')
  };

  config.logger = {
    dir: `/www/logs/node/${appInfo.name}/`
  };

  config.api = {
    /* 生产环境的api配置 */

  };

  return config;
};
