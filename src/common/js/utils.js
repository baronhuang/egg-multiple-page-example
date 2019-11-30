/**
 * 前端工具方法集
 */

/**
 * 把传入的地址转化成json，默认是当前地址
 * @param url 需要获取参数的url地址
 */
export function paramsToJson (url = window.location.href) {
  const regUrl = /^[^?]+\?([\w\W]+)$/;
  const regPara = /([^&=]+)=([\w\W]*?)(&|$|#)/g;
  const arrUrl = regUrl.exec(url);
  const ret = {};
  if (arrUrl && arrUrl[1]) {
    let strPara = arrUrl[1];
    let result;
    while ((result = regPara.exec(strPara)) != null) {
      ret[result[1]] = result[2];
    }
  }
  return ret;
}

/**
 * 自定义模板引擎
 * 用法：
 * var tplStr = '<div>{obj.name}</div>';
 * var obj = { name: 'hello world' };
 * var html = tplEngine(tplStr, obj);
 * @param tpl 模板
 * @param data 数据，必须是对象
 * @returns {*}
 */
export function tplEngine (tpl, data) {
  let reg = /\{([^}]+)?\}/g;
  let match;
  while ((match = reg.exec(tpl)) !== null) {
    tpl = tpl.replace(match[0], data[match[1]]);
  }
  return tpl;
}

export default {
  paramsToJson,
  tplEngine
};
