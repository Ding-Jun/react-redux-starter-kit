/**
 * Created by admin on 2016/11/14.
 */
import 'babel-polyfill';
import path from 'path';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { match } from 'react-router'
import createMemoryHistory from 'react-router/lib/createMemoryHistory'
import qs from 'qs'; // 添加到文件开头

import AppContainer from './containers/AppContainer'

const app = Express();
const port = 3000;


app.use(Express.static(path.join(__dirname, '../dist/build')));
app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../dist/build', 'index.html'))
})
// 每当收到请求时都会触发
app.use(handleRender);
// 接下来会补充这部分代码
function handleRender(req, res) {
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

  })
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )

  // 从 store 中获得初始 state
  const finalState = store.getState();

  // 把渲染后的页面内容发送给客户端
  res.send(renderFullPage(html, finalState));
}
function renderFullPage(html, initialState) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/static/js/main.db0f281d.js"></script>
      </body>
    </html>
    `
}

app.listen(port);
console.log("path.resolve??? : ",path.resolve(__dirname, '../dist/build', 'index.html'));
