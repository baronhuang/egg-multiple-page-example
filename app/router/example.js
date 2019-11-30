/**
 * 使用示例的路由配置
 */

module.exports = app => {
  const { router, controller } = app;
  // 首页
  router.get('/', controller.example.home.exampleHomePage);
  // 详情页
  router.get('/detail/:id', controller.example.detail.exampleDetailPage);
  // vue使用示例
  router.get('/vue', controller.example.vue.exampleVuePage);
};
