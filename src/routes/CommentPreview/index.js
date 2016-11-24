import { injectReducer } from '../../store/reducers'
import { APP_ROOT } from '../../constant'

export default (store) => ({
  path : `${APP_ROOT}/comment/preview/:targetPage`,
  onEnter:requireAuth,
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const CommentPreview = require('./containers/CommentPreviewContainer').default
      const reducer = require('./modules/commentPreview').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'commentPreview', reducer })

      /*  Return getComponent   */
      cb(null, CommentPreview)

    /* Webpack named bundle   */
    }, 'commentPreview')
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
