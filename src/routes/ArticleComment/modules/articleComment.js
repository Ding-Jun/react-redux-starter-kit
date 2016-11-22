/**
 * Created by admin on 2016/11/16.
 */
import axios from 'axios'
import {isArray} from 'lodash'
import queryString from 'query-string'
// ------------------------------------
// Constants
// ------------------------------------
export const ARTICLE_COMMENT_LIST_REQUEST = 'ARTICLE_COMMENT_LIST_REQUEST'
export const ARTICLE_COMMENT_LIST_RECEIVE = 'ARTICLE_COMMENT_LIST_RECEIVE'
export const ARTICLE_COMMENT_LIST_CLEAR   = 'ARTICLE_COMMENT_LIST_CLEAR'
export const ARTICLE_TITLE_SET            = 'ARTICLE_TITLE_SET'
/*
 commentPreview{
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
export function requestArticleCommentList () {
  return {
    type    : ARTICLE_COMMENT_LIST_REQUEST
  }
}
export function receiveArticleCommentList(page) {
  return {
    type    : ARTICLE_COMMENT_LIST_RECEIVE,
    payload : page
  }
}
export function clearArticleCommentList() {
  return {
    type    : ARTICLE_COMMENT_LIST_CLEAR
  }
}
export function setArticleTitle(title) {
  return {
    type    : ARTICLE_TITLE_SET,
    payload : title
  }
}
/*  This is a thunk, meaning it is a function that immediately
 returns a function for lazy evaluation. It is incredibly useful for
 creating async actions, especially when combined with redux-thunk!

 NOTE: This is solely for demonstration purposes. In a real application,
 you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 reducer take care of this logic.  */
export function fetchArticleCommentList(targetPage,query) {
  return (dispatch, getState) => {
    dispatch(requestArticleCommentList())
    return (
      axios.get(`/nczl-web/rs/comment/list?curPage=${targetPage}&pageSize=3&${queryString.stringify({
        ...query,
        status:1
      })}`)
        .then(function (res) {
          console.log(res);
          if(res.data.code== 1){
            dispatch(setArticleTitle(res.data.params.objectTitle))
            dispatch(receiveArticleCommentList(res.data.result))
            Promise.resolve(res.data.result)
          }
        })
        .then(function (page) {

        })
        .catch(function (error) {
          console.log(error);
        })
    )
  }
}

export const actions = {
  clearArticleCommentList,
  fetchArticleCommentList,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ARTICLE_COMMENT_LIST_REQUEST] : (state, action) => ({ ...state , fetching : true }),
  [ARTICLE_COMMENT_LIST_RECEIVE] : (state, action) => ({ ...state, fetching:false, page : action.payload }),
  [ARTICLE_COMMENT_LIST_CLEAR]   : (state, action) => ( initialState ),
  [ARTICLE_TITLE_SET]            : (state, action) => ({ ...state, articleTitle:action.payload })
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = { fetching:false , page:{}, articleTitle:''}
export default function articleCommentReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
