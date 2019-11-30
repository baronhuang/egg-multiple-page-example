/**
 * Helper 函数用来提供一些实用的 utility 函数，通过ctx.helper访问，可以在nunjucks模板里面使用
 */

const _ = require('lodash');
module.exports = {
  /* 把lodash导入到helper里 */
  _,
  /**
   * 传入对象，字符串，数组，根据条件，返回对应的class
   * 用法：
   * classNames('foo', 'bar'); // => 'foo bar'
   * classNames('foo', { bar: true }); // => 'foo bar'
   * classNames({ 'foo-bar': true }); // => 'foo-bar'
   * classNames({ 'foo-bar': false }); // => ''
   * classNames({ foo: true }, { bar: true }); // => 'foo bar'
   * classNames({ foo: true, bar: true }); // => 'foo bar'
   * classNames(['foo', 'bar']); // => 'foo bar'
   * @param args
   * @returns {string}
   */
  classNames (...args) {
    /* 返回组合的class */
    let classes = args.map((item) => {
      if (!item) return '';
      let type = typeof item;
      if (type === 'string' || type === 'number') {
        return item;
      } else if (Array.isArray(item) && item.length) {
        let inner = this.classNames.apply(null, item);
        if (inner) {
          return inner;
        }
      } else if (type === 'object') {
        for (let key in item) {
          if (item.hasOwnProperty(key) && item[key]) {
            return key;
          }
        }
      }
    });

    return classes.join(' ');
  }
};
