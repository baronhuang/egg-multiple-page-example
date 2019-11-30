/**
 * vue使用案例，异步加载模块
 */

import './vue.scss';

// 传统的同步加载
import Vue from 'vue';
import app from './app.vue';
new Vue({
  el: '#app',
  render: h => h(app)
});

// 多个异步js同时加载
// Promise.all([
//   // 打包时给异步的js添加命名
//   import(/* webpackChunkName: 'async' */ 'vue'),
//   import('./app.vue')
// ]).then(([{ default: Vue }, { default: app }]) => {
//   new Vue({
//     el: '#app',
//     render: h => h(app)
//   });
// });

// 按顺序异步加载js
// import('vue').then(async ({ default: Vue }) => {
//   const { default: app } = await import('./app.vue');
//   new Vue({
//     el: '#app',
//     render: h => h(app)
//   });
// });

// require方式异步加载
// require.ensure([], function (require) {
//   const { default: Vue } = require('vue');
//   const { default: app } = require('./app.vue');
//   new Vue({
//     el: '#app',
//     render: h => h(app)
//   });
// }, 'async');

console.log('--------vue-------');
