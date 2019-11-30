/**
 * 首页
 */

module.exports = app => {
  class Home extends app.Controller {
    async exampleHomePage () {
      const ctx = this.ctx;
      const songList = await this.ctx.service.music.getSongList();
      await ctx.render('/example/home/home.html', { songList });
    }
  }

  return Home;
};
