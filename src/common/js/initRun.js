/**
 * 初始化的时候就会执行，在这里用于一些需要全局执行的方法
 */

// 公共头尾的第三方客户依赖jquery
import $ from 'jquery';
window.$ = $;

// 解决IE浏览器报Promise未定义的错误
window.Promise = Promise;
