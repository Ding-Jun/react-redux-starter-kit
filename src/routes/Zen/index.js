/**
 * Created by admin on 2016/11/10.
 */
import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'zen',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Zen = require('./containers/ZenContainer').default
      const reducer = require('./modules/zen').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'zen', reducer })

      /*  Return getComponent   */
      cb(null, Zen)

      /* Webpack named bundle   */
    }, 'zen')
  }
})
