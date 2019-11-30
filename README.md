# egg-multiple-page-example

> 简介：一个使用egg+webpack4结合开发的多页面脚手架demo，包含HMR、es6、sass、vue、tree-shaking、lint-staged等特性，支持通过配置的方式来构建项目，项目结构简单实用。

## 快速开始

```shell

// 1.进到你的项目根目录，安装所有依赖包
$ npm install or yarn

// 2.运行本地webpack服务
$ npm run start 

// 3.启动本地egg服务
$ npm run local

// 编译打包生产的文件
$ npm run build 


// 4.配置 nginx.conf
    server {
        listen 80;
        server_name local.example.com;

        location / {
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://127.0.0.1:7100/;
        }

        #开发环境下使用，生产环境需要注释       
        location /static/ {
            proxy_pass http://127.0.0.1:7200/static/;
        }

    }

// 5.配置hosts 127.0.0.1 local.example.com

// 6.开启nginx.exe

// 7.访问 http://local.example.com

// 8.开始你的开发之旅...

```


## 项目结构

```
egg-multiple-page-example
|
├─app.js egg启动文件，可以在应用启动的时候做点事情
|  
│  
├─app 项目目录，主要存放node端的代码，跟常规的egg目录结构基本一致，具体参考egg的官方文档
│  │  router.js 路由总入口
│  │  
│  ├─controller 控制器模块
│  │  └─example 每个模块一个目录，模块下面还可以分目录
│  │          detail.js 一个页面一个js，里面包含有页面渲染和http接口的逻辑代码
│  │          home.js
│  │          vue.js
│  │          
│  ├─extend 自定义扩展模块
│  │      application.js
│  │      context.js
│  │      helper.js
│  │      request.js
│  │      response.js
│  │      
│  ├─middleware 中间件模块
│  │      errorHandler.js
│  │      
│  ├─router 每个模块的路由配置，一个模块一个文件
│  │      example.js
│  │      
│  └─service 后端服务模块，一个模块一个文件，里面是该模块下后端接口服务
│          music.js
│          
├─build webpack的配置目录
│  │  build.js
│  │  config.js webpack的可配置文件，可以在这里进行一些自定义的配置，简化配置
│  │  devServer.js
│  │  hotReload.js
│  │  utils.js
│  │  webpack.base.conf.js
│  │  webpack.dev.conf.js
│  │  webpack.prd.conf.js
│  │  
│  ├─loaders 自定义webpack loaders
│  │      hot-reload-loader.js
│  │      
│  └─plugins 自定义webpack plugins
│          compile-html-plugin.js
│          
├─config egg的配置文件，分环境配置
│      client.config.js
│      config.default.js
│      config.dev.js
│      config.local.js
│      config.prod.js
│      config.test.js
│      plugin.js
│   
├─dist webpack构建生产环境存放的文件目录
│
├─temp 本地开发时的临时目录，存放编译后的html文件
│
└─src 浏览器端的文件目录
    ├─assets 纯静态资源目录，如一些doc、excel、示例图片等，构建时会复制到dist/static目录下
    ├─common 公共模块，如公共的css和js，可自定义添加
    │  ├─css 公共样式
    │  │      common.scss
    │  │      
    │  └─js 公共js
    │          initRun.js 页面初始化执行的代码块，若有初始化执行的方法可放于此
    │          regex.js 统一正则管理
    │          utils.js 前端工具方法
    │          
    ├─images 图片目录，一个模块一个目录
    │  │  favicon.ico
    │  │  
    │  ├─common 公共图片，目录下面的图片不会转成base64，也不会添加md5，用于可复用的图片和对外提供的图片
    │  └─example 各个模块下面的图片，小图片会转成base64
    │          vue-logo.png
    │          
    └─templates 业务代码目录，存放每个页面和组件的代码，components为保留目录
        ├─components 自定义组件的目录，vue组件放在vue目录下
        │  ├─footer 如果组件包括html、js、css必须要用目录包起来，而且文件名要跟目录名一致
        │  │      footer.html
        │  │      footer.scss
        │  │      
        │  ├─header 如果组件只是html，可以直接html文件即可，这种一般是nunjucks模板
        │  │      header.html
        │  │      
        │  └─vue vue组件的专用目录
        │          helloWorld.vue
        │          
        └─example 各个模块的目录，目录下面还可以再分子目录
            ├─detail  一个目录一个页面，分别包含html、css、js文件，命名跟目录名一致
            │      detail.html
            │      detail.js
            │      detail.scss
            │      
            ├─home
            │      home.html
            │      home.js
            │      home.scss
            │      
            └─vue
                    app.vue
                    vue.html
                    vue.js
                    vue.scss

```

## npm 命令

项目中用到npm命令比较多，下面逐一解释：
- npm run start: 启动本地开发环境的webpack应用
- npm run build: 使用webpack进行生产环境的构建，构建到dist目录下
- npm run local: 启动本地的egg应用
- npm run debug: 启动本地egg应用的调试模式，可以进行断点调试
- npm run proxy: 启动http代理，可用charles进行调试
- npm run dev|test|prod: 本地egg模拟各个环境的启动，这时所用到的浏览器端文件是dist目录下的
- npm run lint: 对项目中的文件进行eslint检查
- npm run fix: 对项目中的文件进行eslint修复
- npm run analyz: 进行webpack生产环境构建后，可以用此命令查看优化后的情况

## 项目配置

项目中有些可自定义的配置，下面来具体看看怎么配置：
```js
// build/config.js
const path = require('path');
const packageJson = require('../package.json');

const devMode = process.env.NODE_ENV !== 'production';
const config = {
  /* 是否为开发模式 */
  devMode,
  /**
   * 静态文件域名，构建时可以根据传入的WEBPACK_HOST参数来修改，适合每个环境不同域名的情况
   * 如果没有对外提供html代码片段的接口一般不需要配置，除非你要单独放到文件服务器或者cdn上
   * 本地开发环境下不能配置域名，否则热更新无效
   */
  // host: process.env.WEBPACK_HOST || devMode ? '' : 'http://local.example.com',
  host: '',
  /* egg项目启动端口 */
  eggPort: 7100,
  /* webpack启动端口 */
  webpackPort: 7200,
  /* build的本地路径 */
  outputPath: devMode ? path.resolve(__dirname, '../static') : path.resolve(__dirname, '../dist/static'),
  /* 静态文件的相对路径，相对于outputPath */
  publicPath: '/static/',
  /* 是否要热更新 */
  reload: true,
  /* html修改以后是否刷新浏览器，不想打开可以设置为false */
  reloadBrowser: true,
  /* webpack打包缓存目录 */
  cacheDir: `/www/jenkins/workspace/_webpack_cache/${packageJson.name}/`
};

/* 若有提供host，需要把host放到publicPath之前 */
if (config.host) {
  config.publicPath = `${config.host}${config.publicPath}`;
}

module.exports = config;
```

一般来说你要注意配置的只是eggPort、webpackPort这两个端口和publicPath相对路径，它必须跟你的nginx配置中的端口一致，才能正确打通，比对一下上面的nginx配置文档就大概明白了。


