/**
 * 扩展 Context 对象，每次请求生成一个 Context 实例，通过this.ctx访问
 */

const _ = require('lodash');

module.exports = {
  /**
   * 自定义http请求方法，可以在这里对后端接口进行签名、传cookie等工作
   * @param url 请求地址
   * @param options 配置选项
   * @returns {*}
   */
  async $http (url, options = {}) {
    const ctx = this;

    let defaults = {
      headers: {
        Cookie: ctx.headers.cookie || ''
      },
      dataType: 'json'
    };
    options = _.merge({}, defaults, options);

    try {
      let startTime = new Date().getTime();
      const res = await ctx.curl(url, options);
      // 接口异常，抛出
      if (res.status !== 200) {
        const message = res.data && res.data.message;
        throw {
          status: res.status,
          message
        };
      }

      let countTime = new Date().getTime() - startTime;
      // 如果请求时间大于1秒，需要进行打印，方便日后定位问题
      if (countTime > 1000) {
        this.logger.error('--------------------curl long time', url, countTime);
      }

      return res;
    } catch (err) {
      this.logger.error('--------------------curl error', err.status, url);
      this.logger.error(err);

      throw err;
    }
  }
};
