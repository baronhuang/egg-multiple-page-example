/**
 * 音乐模块接口
 */

module.exports = app => {
  const { musicApi } = app.config.api;
  class User extends app.Service {
    /**
     * 获取歌曲列表
     * @returns Array
     */
    async getSongList () {
      const res = await this.ctx.$http(`${musicApi}/personalized/newsong`);
      return res.data && res.data.result;
    }

    /**
     * 根据id获取歌曲详情
     * @param ids 歌曲id
     * @returns Array
     */
    async getSongDetail (ids) {
      const res = await this.ctx.$http(`${musicApi}/song/detail`, {
        data: {
          ids
        }
      });
      return (res.data && res.data.songs && res.data.songs[0]) || {};
    }
  }

  return User;
};
