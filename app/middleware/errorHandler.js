/**
 * 错误捕获，可以在这里统一对一些错误进行记录，写入日志等
 */

module.exports = () => {
  return function * (next) {
    try {
      yield next;
    } catch (err) {
      this.logger.error('--------------------------------------error', this.originalUrl);
      const status = err.status || 500;
      this.body = {
        code: status,
        msg: err.message,
        data: null
      };
    }
  };
};
