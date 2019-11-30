
'use strict';
const path = require('path');
const merge = require('lodash/merge');
const buildConfig = require('../build/config');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1550309179366_8825';

  // 项目的启动配置，egg-scripts优先级更高
  config.cluster = {
    listen: {
      // 启动端口
      port: buildConfig.eggPort
    }
  };

  // 模板引擎配置
  config.view = {
    defaultViewEngine: 'nunjucks',
    cache: true,
    mapping: {
      '.tpl': 'nunjucks',
      '.nj': 'nunjucks',
      '.html': 'nunjucks'
    },
    root: [
      path.join(appInfo.baseDir, 'app/view')
    ].join(',')
  };

  // 表单提交大小限制
  config.bodyParser = {
    formLimit: '20mb',
    jsonLimit: '20mb',
    queryString: {
      arrayLimit: 10000, // 默认的100是不够的，超过100以后会变成对象，坑得一B
      depth: 5,
      parameterLimit: 10000
    }
  };

  config.multipart = {
    // 最大上传大小
    fileSize: '100mb'
  };

  config.httpclient = {
    request: {
      // 默认 request 超时时间
      timeout: 10000
    }
  };

  // 添加http代理，可用charles进行调试
  if (process.env.http_proxy) {
    config.httpclient.request = {
      ...config.httpclient.request,
      enableProxy: true,
      rejectUnauthorized: false
      // proxy: process.env.http_proxy
    };
  }

  // add your middleware config here
  config.middleware = [];

  /** session  */
  config.session = {
    key: appInfo.name,
    httpOnly: true,
    encrypt: true,
    maxAge: false
  };

  // 自定义的配置
  const userConfig = {
    api: {
      musicApi: 'https://music.aityp.com'
    }
  };

  return {
    ...config,
    ...userConfig
  };
};
