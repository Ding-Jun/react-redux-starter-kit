const express = require('express')
const debug = require('debug')('app:server')
const webpack = require('webpack')
const fs = require('fs-extra');
const webpackConfigClient = require('../build/webpack.config.client')
const config = require('../config')
const universalMiddleware = require('./middleware/universal')
const co = require('co')
const paths = config.utils_paths

module.exports = function* (){
  const app = express()
  var clientInfo

  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement universal
  // rendering, you'll want to remove this middleware.
  if (!config.universal || !config.universal.enabled) {
    // This rewrites all routes requests to the root /index.html file
    // (ignoring file requests).
    debug('Enable HistoryApiFallback middleware.')
    app.use(require('connect-history-api-fallback')())


  }

  // ------------------------------------
  // Apply Webpack HMR Middleware
  // ------------------------------------
  if (config.env === 'development') {
    const compiler = webpack(webpackConfigClient)

    // Catch the hash of the build in order to use it in the universal middleware
    config.universal && config.universal.enabled && compiler.plugin('done', stats => {
      // Create client info from the fresh build
      let {hash, version, assetsByChunkName} = stats
      clientInfo = {
        assetsByChunkName: {
          app: `app.${stats.hash}.js`,
          vendor: `vendor.${stats.hash}.js`
        }
      }
    })

    debug('Enable webpack dev and HMR middleware')
    app.use(require('webpack-dev-middleware')(compiler, {
      publicPath  : webpackConfigClient.output.publicPath,
      contentBase : paths.src(),
      hot         : true,
      quiet       : config.compiler_quiet,
      noInfo      : config.compiler_quiet,
      lazy        : false,
      stats       : config.compiler_stats
    }))

    app.use(require('webpack-hot-middleware')(compiler))

    // Serve static assets from ~/src/static since Webpack is unaware of
    // these files. This middleware doesn't need to be enabled outside
    // of development since this directory will be copied into ~/dist
    // when the application is compiled.
    debug(`express use static folder:${paths.src('static')}`)
    app.use(express.static(paths.src('static')))
  } else {
    if (config.universal.enabled) {
      // Get assets from client_info.json
      debug('Read client info.')
      fs.readJSON(paths.dist(config.universal.client_info), (err, data) => {
        if (err) {
          clientInfo = {}
          debug('Failed to read client_data!')
          return
        }
        clientInfo = data
      })
    } else {
      debug(
        'Server is being run outside of live development mode, meaning it will ' +
        'only serve the compiled application bundle in ~/dist. Generally you ' +
        'do not need an application server for this and can instead use a web ' +
        'server such as nginx to serve your static files. See the "deployment" ' +
        'section in the README for more information on deployment strategies.'
      )
    }

    // Serving ~/dist by default. Ideally these files should be served by
    // the web server and not the app server, but this helps to demo the
    // server in production.
    debug(`express use static folder:${paths.public()}`)
    app.use(express.static(paths.public()))


  }
  //服务器端编译
  if (config.universal && config.universal.enabled) {
    let um = yield universalMiddleware()
    app.use(um.default(() => clientInfo))
  }

  return Promise.resolve(app)
}
