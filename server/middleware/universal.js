const Webpack =require('webpack')
const config =require('../../config')
const webpackConfig =require('../../build/webpack.config.server')
const debug =require('debug')('app:server:universal')

const paths = config.utils_paths
const {__DEV__} = config.globals
const output = paths.dist(config.universal.output)

module.exports = function* () {
  debug('Enable universal middleware.')

  if (__DEV__) {
    try {
      debug('Compile server.')
      yield compileServer()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return Promise.resolve(require(output))
}

function compileServer () {
  return new Promise((resolve, reject) => {
    let compiler = Webpack(webpackConfig)

    compiler.plugin('done', stats => {
      debug('Hash: ' + stats.hash)
      resolve(true)
    })

    compiler.run(function (err, stats) {
      if (err) {
        reject(err)
      }
    })
  })
}
