/**
 * 热更新配置
 */

require('eventsource-polyfill');
// dynamicPublicPath参数会把publicPath放到path前面
const hot = require(`webpack-hot-middleware/client?noInfo=true&reload=true&path=_hmr&dynamicPublicPath=true`);
hot.subscribe(function (event) {
  if (event.action === 'reload' || event.reload === true) {
    window.location.reload();
  }
});
