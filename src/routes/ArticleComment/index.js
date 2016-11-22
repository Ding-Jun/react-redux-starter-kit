import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : '/article/comment/:targetPage',
  onEnter:requireAuth,
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const ArticleComment = require('./containers/ArticleCommentContainer').default
      const reducer = require('./modules/articleComment').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'articleComment', reducer })

      /*  Return getComponent   */
      cb(null, ArticleComment)

    /* Webpack named bundle   */
    }, 'articleComment')
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
