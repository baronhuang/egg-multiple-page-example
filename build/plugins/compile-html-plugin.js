/**
 * 自定义webpack插件，用于优化多页面html的编译的。
 * 为什么要编写这个插件：
 * htmlWebpackPlugin在多页面的情况下，一个页面的修改，会触发所有页面的编译（dev环境下），一旦项目的页面超过一定量（几十个吧）就会变得非常慢。
 * 使用该插件替换htmlWebpackPlugin不会触发所有页面的编译，只会编译你当前修改的页面，因此速度是非常快的，并且写入到temp目录。
 * 插件主要使用到自定义webpack plugin的一些事件和方法，具体可以参考文档：
 * https://doc.webpack-china.org/api/plugins/compiler
 * https://doc.webpack-china.org/api/plugins/compilation
 */

'use strict';
const vm = require('vm');
const fs = require('fs');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const config = require('../config');

class CompileHtmlPlugin {
  constructor (options) {
    this.options = options || {};
  }
  // 将 `apply` 定义为其原型方法，此方法以 compiler 作为参数
  apply (compiler) {
    const self = this;
    self.isInit = false; // 是否已经第一次初始化编译了
    self.rawRequest = null; // 记录当前修改的html路径，单次编译html会用到

    /**
     * webpack4的插件添加compilation钩子方法附加到CompileHtmlPlugin插件上
     */
    compiler.hooks.compilation.tap('CompileHtmlPlugin', (compilation) => {
      /* 单次编译模块时会执行，试了很多方法，就只有这个方法能够监听单次文件的编译 */
      compilation.hooks.succeedModule.tap('CompileHtmlPlugin', function (module) {
        /* module.rawRequest属性可以获取到当前模块的路径，并且只有html和nj文件才进行编译 */
        if (self.isInit && module.rawRequest && /^\.\/src\/templates(.+)\.(html|nj)$/g.test(module.rawRequest)) {
          console.log('build module');
          self.rawRequest = module.rawRequest;
        }
      });
    });

    /**
     * 编译完成后，在发送资源到输出目录之前
     */
    compiler.hooks.emit.tapAsync('CompileHtmlPlugin', (compilation, cb) => {
      /* webpack首次执行 */
      if (!self.isInit) {
        /* 遍历所有的entry入口文件 */
        _.each(compilation.assets, function (asset, key) {
          if (/\.(html|nj)\.js$/.test(key)) {
            const filePath = key.replace('.js', '').replace('js/', 'temp/');
            const dirname = filePath.substr(0, filePath.lastIndexOf('/'));
            const source = asset.source();

            self.compileCode(compilation, source).then(function (result) {
              self.insertAssetsAndWriteFiles(key, result, dirname, filePath);
            });
          }
        });

        /* 单次修改html执行 */
      } else {
        /* rawRequest不为空，则表明这次修改的是html，可以执行编译 */
        if (self.rawRequest) {
          const assetKey = self.rawRequest.replace('./src/templates', 'js') + '.js';
          console.log(assetKey);
          const filePath = assetKey.replace('.js', '').replace('js/', 'temp/');
          const dirname = filePath.substr(0, filePath.lastIndexOf('/'));
          /* 获取当前的entry */
          const source = compilation.assets[assetKey].source();

          self.compileCode(compilation, source).then(function (result) {
            self.insertAssetsAndWriteFiles(assetKey, result, dirname, filePath, true);
          });
        }
      }

      cb();
    });

    /**
     * 编译完成，进行一些属性的重置
     */
    compiler.hooks.done.tap('CompileHtmlPlugin', (compilation) => {
      if (!self.isInit) {
        self.isInit = true;
      }
      self.rawRequest = null;
    });
  }

  /**
   * 用于把require进来的*.html.js进行沙箱执行，获取运行以后返回的html字符串
   * 使用vm模块，在V8虚拟机上下文中提供了编译和运行代码的API
   * @param compilation webpack compilation 对象
   * @param source 源代码
   * @returns {*}
   */
  compileCode (compilation, source) {
    if (!source) {
      return Promise.reject(new Error('请输入source'));
    }

    /* 定义vm的运行上下文，就是一些全局变量 */
    const vmContext = vm.createContext(_.extend({ require: require }, global));
    const vmScript = new vm.Script(source, {});
    // 编译后的代码
    let newSource;
    try {
      /* newSouce就是在沙箱执行js后返回的结果，这里用于获取编译后的html字符串 */
      newSource = vmScript.runInContext(vmContext);
      return Promise.resolve(newSource);
    } catch (e) {
      console.log('-------------compileCode error', e);
      return Promise.reject(e);
    }
  }

  /**
   * 把js和css插入到html模板，并写入到temp目录里面
   * @param assetKey  当前的html在entry对象中的key
   * @param result  html的模板字符串
   * @param dirname 写入的目录
   * @param filePath  写入的文件路径
   * @param isReload  是否需要通知浏览器刷新页面，前提是使用插件时必须传入hotMiddleware
   */
  insertAssetsAndWriteFiles (assetKey, result, dirname, filePath, isReload) {
    let self = this;
    let styleTag = `<link href="${config.publicPath}css/${assetKey.replace('.html.js', '.css').replace('js/', '')}" rel="stylesheet" />`;
    let scriptTag = `<script src="${config.publicPath}${assetKey.replace('.html.js', '.js')}"></script>`;

    result = result.replace('</head>', `${styleTag}</head>`);
    result = result.replace('</body>', `${scriptTag}</body>`);

    mkdirp(dirname, function (err) {
      if (err) {
        console.error(err);
      } else {
        fs.writeFile(filePath, result, function (err) {
          if (err) {
            console.error(err);
          }

          // 通知浏览器更新
          if (isReload) {
            self.options.hotMiddleware && self.options.hotMiddleware.publish({ action: 'reload' });
          }
        });
      }
    });
  }
}

module.exports = CompileHtmlPlugin;
