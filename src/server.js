/**
 * Created by admin on 2016/11/14.
 */
import React from 'react'
import { match } from 'react-router'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { syncHistoryWithStore } from 'react-router-redux'
import createMemoryHistory from 'react-router/lib/createMemoryHistory'
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'
import _debug from 'debug'
import { renderHtmlLayout } from 'helmet-webpack-plugin'
import config from '../config'
import router from '../server/router'
import qs from 'qs'; // 添加到文件开头
const debug = _debug('app:server:universal:render')

export default (getClientInfo) => {
  return function (req, res, next) {
    console.log("req")
    // 如果存在的话，从 request 读取 counter
    const params = qs.parse(req.query)
    const counter = parseInt(params.counter) || 0
    const memoryHistory = createMemoryHistory(req.url);

    let initialState = { counter: counter }

    // 创建新的 Redux store 实例
    const store = createStore(rootReducer,initialState);
    const routes = require('./routes/index').default(store)
    const history = syncHistoryWithStore(memoryHistory, store, {
      selectLocationState: (state) => state.router
    })

    // 把组件渲染成字符串
    match({history, routes, location: req.url},  (err, redirect, props) => {
      // ----------------------------------
      // Internal server error
      // ----------------------------------
      if (err) {
        handleError({status: 500, message: 'Internal server error', error: err})
        return
      }

      // ----------------------------------
      // No route matched
      // This should never happen if the router has a '*' route defined
      // ----------------------------------
      if (typeof err === 'undefined' && typeof redirect === 'undefined' && typeof props === 'undefined') {
        debug('No route found.')

        // We could call our next middleware maybe
        // await next()
        // return

        // Or display a 404 page
        handleError({status: 404, message: 'Page not found'})
        return
      }

      const html = renderToString(
         <AppContainer
            history={history}
            routerKey={Math.random()}
            routes={routes}
            store={store} />      
      )
      // 从 store 中获得初始 state
      const finalState = store.getState();

      // 把渲染后的页面内容发送给客户端
      let {app, vendor} = getClientInfo().assetsByChunkName
      res.send(renderFullPage(html, finalState, app, vendor));

    })
  }
}

function renderFullPage(html, initialState,app,vendor) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.___INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="${vendor}"></script>
        <script src="${app}"></script>
      </body>
    </html>
    `
}