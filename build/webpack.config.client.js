const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const clone = require('clone')
const config = require('../config')
const debug = require('debug')('app:webpack:config')

const paths = config.utils_paths
const {__DEV__, __PROD__, __TEST__} = config.globals

debug('Create client configuration.')
const webpackConfigClient = clone(webpackConfig)

webpackConfigClient.name = 'client'
webpackConfigClient.target = 'web'

// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = paths.src(config.entry_client)

webpackConfigClient.entry = {
  app : __DEV__
    ? [APP_ENTRY].concat(`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`)
    : [APP_ENTRY],
  vendor : config.compiler_vendors
}

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfigClient.output = {
  filename   : `[name].[${config.compiler_hash_type}].js`,
  path       : paths.public(),
  publicPath : config.compiler_public_path
}


// ------------------------------------
// Plugins
// ------------------------------------
webpackConfigClient.plugins = [
  // Plugin to show any webpack warnings and prevent tests from running
  function () {
    let errors = []
    this.plugin('done', function (stats) {
      if (stats.compilation.errors.length) {
        // Log each of the warnings
        stats.compilation.errors.forEach(function (error) {
          errors.push(error.message || error)
        })

        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were warnings.
        throw new Error(errors)
      }
    })
  },
  new webpack.DefinePlugin(config.globals),
  new HtmlWebpackPlugin({
    template : paths.client('index.html'),
    hash     : false,
    favicon  : paths.client('static/favicon.ico'),
    filename : 'index.html',
    inject   : 'body',
    minify   : {
      collapseWhitespace : true
    }
  })
]

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')
  webpackConfigClient.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
} else if (__PROD__) {
  debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).')
  webpackConfigClient.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress : {
        unused    : true,
        dead_code : true,
        warnings  : false
      }
    })
  )
}

// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
  webpackConfigClient.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names : ['vendor']
    })
  )
}

// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (!__DEV__) {
  debug('Apply ExtractTextPlugin to CSS loaders.')
  webpackConfigClient.module.loaders.filter((loader) =>
    loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
  ).forEach((loader) => {
    const first = loader.loaders[0]
    const rest = loader.loaders.slice(1)
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'))
    delete loader.loaders
  })

  webpackConfigClient.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks : true
    })
  )
}

export default webpackConfigClient
