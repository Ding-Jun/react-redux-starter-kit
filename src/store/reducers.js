import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { modalReducer } from 'components/Modal'
//import locationReducer from './location'

// Fix: "React-Redux: Combining reducers: Unexpected Keys"
// http://stackoverflow.com/a/33678198/789076
const initialReducers = {
  articlePreview:(state = require('../routes/ArticlePreview/modules/articlePreview').initialState) => state,
  articleComment:(state = require('../routes/ArticleComment/modules/articleComment').initialState) => state,
  articleDetail:(state = require('../routes/ArticleDetail/modules/articleDetail').initialState) => state,
  columnPreview:(state = require('../routes/ColumnPreview/modules/columnPreview').initialState) => state,
  commentPreview:(state = require('../routes/CommentPreview/modules/commentPreview').initialState) => state,
  counter: (state = 0) => state,
  zen: (state = require('../routes/Zen/modules/zen').initialState) => state
}

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    router,
    modal:modalReducer,
    ...initialReducers,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  //if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
