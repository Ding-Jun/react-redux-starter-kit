import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : '/article/preview/:columnId/:targetPage',
  onEnter:requireAuth,
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const ArticlePreview = require('./containers/ArticlePreviewContainer').default
      const reducer = require('./modules/articlePreview').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'articlePreview', reducer })

      /*  Return getComponent   */
      cb(null, ArticlePreview)

    /* Webpack named bundle   */
    }, 'articlePreview')
  }
})

function requireAuth(nextState, replace) {
  console.log("hehe")
  /*if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }*/
}
