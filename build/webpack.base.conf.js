/**
 * 公用webpack配置
 */

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HappyPack = require('happypack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const os = require('os');
const mkdirp = require('mkdirp');
const { devMode, cacheDir, outputPath, publicPath, reload } = require('./config');
const utils = require('./utils');

// 使用cpu的一半数量就足够了，太多的话电脑会卡
const threadSize = os.cpus().length / 2;
const happyThreadPool = HappyPack.ThreadPool({ size: threadSize });
let entry = './src/templates/**/*.{js,html,nj}';
if (!devMode) {
  entry = './src/templates/**/*.js';
}

// Ensure `postcss` key is extracted 必须要开启这个，不然postcss的plugins在happypack里面无法生效
HappyPack.SERIALIZABLE_OPTIONS = HappyPack.SERIALIZABLE_OPTIONS.concat(['postcss']);

// 需要手动新建目录，不然mac系统会报错
mkdirp.sync(cacheDir);

const webpackConfig = {
  entry: utils.initEntries(entry),
  output: {
    path: outputPath,
    filename: 'js/[name].js',
    publicPath: publicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [path.join(__dirname, '../src'), 'node_modules'],
    alias: {
      '@': path.join(__dirname, '../src')
    }
  },
  resolveLoader: {
    // 让webpack去寻找自定义的loaders
    modules: [path.join(__dirname, './loaders'), 'node_modules']
  },
  module: {
    rules: [
      // 使用vue-loader将vue文件编译转换为js
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // 开发环境，给js添加HMR代码
      {
        test: /\.js$/,
        loaders: devMode && reload ? [].concat(['hot-reload-loader']) : [],
        include: [path.join(__dirname, '../src/templates')]
      },
      (function (devMode) {
        let obj = {
          test: /\.(vue|js|jsx)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          exclude: [
            path.join(__dirname, '../node_modules'),
            path.join(__dirname, '../src/libs')
          ]
        };
        return devMode ? Object.assign(obj, {
          options: {
            formatter: require('eslint-formatter-friendly'),
            cache: `${cacheDir}eslint-loader`
          }
        }) : Object.assign(obj, {
          loader: 'happypack/loader?id=eslint'
        });
      })(devMode),
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=babel',
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        loaders: utils.initCssLoaders('sass')
      },
      {
        test: /\.less$/,
        loaders: utils.initCssLoaders('less')
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4000,
          name: 'img/[name].[hash:7].[ext]'
        },
        exclude: [path.join(__dirname, '../src/images/common')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]'
        },
        // 只有在这个目录下面的图片资源不会转成base64
        include: [path.join(__dirname, '../src/images/common')]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        // 最好使用url-loader，解决字体跨域的问题
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(html|nj)$/,
        loader: 'html-loader',
        include: [path.join(__dirname, '../src/templates')],
        options: {
          // 必须false，不然html有base64会报错
          minimize: false,
          // 解析html中的require语句
          interpolate: true
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    utils.initStyleHappy('less', { threadPool: happyThreadPool, threads: threadSize }),
    utils.initStyleHappy('sass', { threadPool: happyThreadPool, threads: threadSize }),
    new HappyPack({
      id: 'babel',
      // 共享进程池
      threadPool: happyThreadPool,
      threads: threadSize,
      loaders: [ `babel-loader?cacheDirectory=${cacheDir}babel-loader` ]
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash:7].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[name].[contenthash:7].css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};

// 生产环境需要开启eslint happypack
if (!devMode) {
  webpackConfig.plugins.push(new HappyPack({
    id: 'eslint',
    // 共享进程池
    threadPool: happyThreadPool,
    threads: threadSize,
    loaders: [{
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint-formatter-friendly'),
        cache: `${cacheDir}eslint-loader`
      }
    }]
  }));
}

module.exports = webpackConfig;
