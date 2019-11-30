/**
 * 路由总配置入口，若是分模块开发，最好把每个模块的路由放到router文件夹下面，然后统一在这里require进来
 */

module.exports = app => {
  // 使用示例
  require('./router/example')(app);
};
