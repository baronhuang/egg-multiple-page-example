/**
 * 本地环境配置
 */

/* 本地环境配置 */
const path = require('path');
module.exports = (appInfo) => {
  const config = {};
  config.view = {
    root: [
      /* 自定义目录 */
      path.join(__dirname, '../temp')
    ].join(',')
  };
  return config;
};
