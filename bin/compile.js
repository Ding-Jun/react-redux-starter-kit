const fs = require('fs-extra')
const co = require('co')
const debug = require('debug')('app:bin:compile')
const webpackCompiler = require('../build/webpack-compiler')
const webpackConfigClient = require('../build/webpack.config.client')
const webpackConfigServer = require('../build/webpack.config.server')
const config = require('../config')

const paths = config.utils_paths
const clientInfo = paths.dist(config.universal.client_info)

const compile = function *() {
  try {
    let stats

    debug('Run compiler for client.')
    stats = yield webpackCompiler(webpackConfigClient)
    if (stats.warnings.length && config.compiler_fail_on_warning) {
      throw new Error('Config set to fail on warning, exiting with status code "1".')
    }

    debug('Write client info')
    let {hash, version, assetsByChunkName} = stats
    yield writeClientInfo({hash, version, assetsByChunkName})

    if (config.universal && config.universal.enabled) {
      debug('Run compiler for server')
      stats = yield webpackCompiler(webpackConfigServer)
      if (stats.warnings.length && config.compiler_fail_on_warning) {
        throw new Error('Config set to fail on warning, exiting with status code "1".')
      }
    }

    debug('Copy static assets to dist folder.')
    fs.copySync(paths.src('static'), paths.public())
  } catch (e) {
    debug('Compiler encountered an error.', e)
    process.exit(1)
  }
}

co(compile)

function writeClientInfo (data) {
  return new Promise((resolve, reject) => {
    fs.writeJson(clientInfo, data, function (err) {
      if (err) {
        reject(err)
      }
      resolve(true)
    })
  })
}
