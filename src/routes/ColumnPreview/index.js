import { injectReducer } from '../../store/reducers'
import { APP_ROOT } from 'constant'

export default (store) => ({
  path : `${APP_ROOT}/column/preview/:targetPage`,
  onEnter:requireAuth,
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const ColumnPreview = require('./containers/ColumnPreviewContainer').default
      const reducer = require('./modules/columnPreview').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'columnPreview', reducer })

      /*  Return getComponent   */
      cb(null, ColumnPreview)

    /* Webpack named bundle   */
    }, 'columnPreview')
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
