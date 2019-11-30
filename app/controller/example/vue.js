/**
 * vue使用示例
 */

module.exports = app => {
  class Vue extends app.Controller {
    async exampleVuePage () {
      const ctx = this.ctx;
      await ctx.render('/example/vue/vue.html');
    }
  }

  return Vue;
};
