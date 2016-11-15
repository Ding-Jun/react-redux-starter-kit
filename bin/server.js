const co = require('co')
const config = require('../config')
const server = require('../server/main')
const debug = require('debug')('app:bin:server')

co(function *(){
  const port = config.server_port
  const host = config.server_host
  let app = yield co(server)
  app.listen(port)
  debug(`Server is now running at http://${host}:${port}.`)
})