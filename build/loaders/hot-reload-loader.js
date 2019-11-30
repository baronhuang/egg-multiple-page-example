/**
 * 自定义loader，给页面的js添加热更新代码
 */

module.exports = function (source) {
  // 如果当前的文件路径是vue模块，则不需要添加热更新代码
  if (this._module.rawRequest.includes('vue-loader/lib/index.js')) {
    return source;
  }

  let result = source + `
      if (module.hot) {
        module.hot.accept();
    }
`;
  return result;
};
