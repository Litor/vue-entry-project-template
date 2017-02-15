var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var vueEntry = require('vue-entry')

var isDeveloper = process.env.NODE_ENV != 'production'
var vueEntryUtils = require('vue-entry/dist/bootstrap/utils')

// 单app模式或多app模式
var projectType = vueEntryUtils.checkProjectType('./src')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: vueEntry.default({src:'./src'}),
  /*output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },*/
  output:{
    path:config.build.assetsRoot,
    publicPath: projectType === 'singleApp' ? './' : '../',
    filename: isDeveloper ? '[name].js' : '[name]-[chunkhash].js',
    chunkFilename: 'statics/chunk/[name]-[id].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /index\.html$/i,
        exclude: [/\/components\//],
        loader: 'file-loader',
        query: {
          context: path.resolve(config.dev.pages),
          name: '[path][name].[ext]'
        }
      },
      {
        test: /config\.json$/i,
        exclude: [/\/components\//],
        loader: 'file-loader',
        query: {
          context: path.resolve(config.dev.pages),
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.lang\.json$/i,
        exclude: [/\/components\//],
        loader: 'file-loader',
        query: {
          context: vueEntryUtils.getEntryFilePath(),
          name: '[path][name].[ext]'
        }
      }
    ]
  }
}
