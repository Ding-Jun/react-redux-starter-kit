/**
 * Created by admin on 2016/11/16.
 */

// ------------------------------------
// Constants
// ------------------------------------
export const ARTICLE_PAGE_REQUEST = 'ARTICLE_PAGE_REQUEST'
export const ARTICLE_PAGE_RECEIVE = 'ARTICLE_PAGE_RECEIVE'
export const ARTICLE_PAGE_CLEAR = 'ARTICLE_PAGE_CLEAR'
/*
articlePreview{
 fetching:Boolean,		//是否请求数据中
 page:{
   curpage:Number,		//当前页码
   rowData:Array,		  //文章数组
 ...
 },
 query:{
   columnId:Number,	  //栏目ID
   title:String		    //文章关键字
 }
}
*/

// ------------------------------------
// Actions
// ------------------------------------
export function requestArticlePage () {
  return {
    type    : ARTICLE_PAGE_REQUEST
  }
}
export function receiveArticlePage(page) {
  return {
    type    :ARTICLE_PAGE_RECEIVE,
    payload :page
  }
}
export function clearArticlePage() {
  return {
    type    :ARTICLE_PAGE_CLEAR
  }
}
/*  This is a thunk, meaning it is a function that immediately
 returns a function for lazy evaluation. It is incredibly useful for
 creating async actions, especially when combined with redux-thunk!

 NOTE: This is solely for demonstration purposes. In a real application,
 you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 reducer take care of this logic.  */
export function fetchArticlePage(targetPage,query) {
  return (dispatch, getState) => {
    dispatch(requestArticlePage())
    return fetch('https://api.github.com/zen')
      .then(data => data.text())
      .then(text => dispatch(recieveZen(text)))
  }
}

export const actions = {
  requestArticlePage,
  receiveArticlePage,
  clearArticlePage,
  fetchArticlePage
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ARTICLE_PAGE_REQUEST] : (state, action) => ({ ...state , fetching : true }),
  [ARTICLE_PAGE_RECEIVE] : (state, action) => ({ ...state , fetching : false , page : action.payload }),
  [ARTICLE_PAGE_CLEAR]   : (state, action) => ({ ...state , fetching : false , page : [] })
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {fetching:false,page:[]}
export default function articlePreviewReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
