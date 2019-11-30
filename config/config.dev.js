/**
 * 开发环境配置
 */

const prodConf = require('./config.prod');
module.exports = (appInfo) => {
  const config = prodConf(appInfo);
  // ..这里可以根据不同环境设置不同的配置
  return config;
};
