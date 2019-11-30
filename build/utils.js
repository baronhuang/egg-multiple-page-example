/**
 * webpack构建时用到的工具方法
 */

const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HappyPack = require('happypack');
const { devMode } = require('./config');

module.exports = {
  /**
   * 初始化entry文件
   * @param globPath 遍历的文件路径
   * @returns {{}}  webpack entry入口对象
   */
  initEntries (globPath) {
    let files = glob.sync(globPath);
    let entries = {};
    files.forEach(function (file) {
      let ext = path.extname(file);
      /* 只需获取templates下面的目录 */
      let entryKey = file.split('/templates/')[1].split('.')[0];
      if (ext === '.js') {
        /* 组件不需要添加initRun.js */
        if (!(file.includes('/templates/components/'))) {
          entries[entryKey] = ['./src/common/js/initRun.js', file];
        } else {
          entries[entryKey] = file;
        }
      } else {
        entries[entryKey + ext] = file;
      }
    });

    return entries;
  },
  /**
   * 初始化htmlWebpackPlugin插件配置
   * @param globPath 遍历的文件路径
   * @returns {Array} 插件本身
   */
  initHtmlWebpackPlugin (globPath) {
    const files = glob.sync(globPath);
    let plugins = [];
    files.forEach(function (file, i) {
      /* 获取当前的entry name */
      const name = file.match(/templates\/(.*)\.(html|nj)$/)[1];
      let ext = path.extname(file);
      let filename = '';
      let options = {};
      /* 生产环境要用本地文件路径 */
      filename = path.resolve(__dirname, '.' + file.replace('/src/templates/', '/dist/templates/'));
      options = {
        minify: {
          removeComments: true
          // collapseWhitespace: true,
          // removeAttributeQuotes: true
        },
        chunks: ['manifest', 'vendor', 'common', name],
        inject: true
      };

      /* 如果是组件 */
      if (name.includes('components/')) {
        plugins.push(new HtmlWebpackPlugin({
          template: path.resolve(__dirname, '.' + file),
          filename: filename,
          inject: false
        }));
      } else {
        /* 如果是html模板 */
        if (ext === '.nj') {
          plugins.push(new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '.' + file),
            filename: filename,
            inject: false
          }));
        /* 如果是html页面 */
        } else {
          plugins.push(new HtmlWebpackPlugin(Object.assign({
            // html模板路径
            template: path.resolve(__dirname, '.' + file),
            // 编译后的html存放路径
            filename: filename,
            // 每个页面需要用到的那些js和css，不配置的话，会引入所有的模块
            chunks: [name],
            favicon: path.resolve(__dirname, '../src/images/favicon.ico')
          }, options)));
        }
      }
    });

    plugins.push(new HtmlWebpackInlineSourcePlugin());
    return plugins;
  },
  /**
   * 初始化css loader配置
   * @param name  loader名
   * @returns {*} loader配置
   */
  initCssLoaders (name) {
    let loaders = [
      MiniCssExtractPlugin.loader,
      `happypack/loader?id=${name}`
    ];

    if (devMode) {
      loaders.unshift('css-hot-loader');
    }
    return loaders;
  },
  /**
   * 初始化样式的happyPack
   * @param name
   * @param options
   * @returns {HappyPlugin}
   */
  initStyleHappy (name, options) {
    const { threadPool, threads } = options;
    return new HappyPack({
      id: name,
      threadPool,
      threads,
      loaders: [
        {
          loader: 'css-loader',
          options: {
            sourceMap: false,
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: false
          }
        },
        {
          loader: `${name}-loader`,
          options: {
            sourceMap: false
          }
        }
      ]
    });
  }
};
