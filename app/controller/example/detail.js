/**
 * 歌曲详情页
 */

module.exports = app => {
  class Detail extends app.Controller {
    async exampleDetailPage () {
      const ctx = this.ctx;
      const id = ctx.params.id;
      const songDetail = await this.ctx.service.music.getSongDetail(id);
      await ctx.render('/example/detail/detail.html', { songDetail });
    }
  }

  return Detail;
};
