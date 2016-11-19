/**S
 * Created by admin on 2016/11/16.
 */
import axios from 'axios'
import queryString from 'query-string'
// ------------------------------------
// Constants
// ------------------------------------
export const ARTICLE_REQUEST = 'ARTICLE_REQUEST'
export const ARTICLE_RECEIVE = 'ARTICLE_RECEIVE'
export const ARTICLE_CLEAR   = 'ARTICLE_CLEAR'
export const ARTICLE_SET     = 'ARTICLE_SET'
export const COLUMN_SELECT_RECEIVE = 'COLUMN_SELECT_RECEIVE'
export const COLUMN_SELECT_REQUEST = 'COLUMN_SELECT_REQUEST'

export const ARTICLE_STATUS_STOP    = 0    //已停止
export const ARTICLE_STATUS_RELEASE = 1    //已发布
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
export function requestArticle () {
  return {
    type    : ARTICLE_REQUEST
  }
}
export function receiveArticle (article) {
  return {
    type    : ARTICLE_RECEIVE,
    payload : article
  }
}
export function clearArticle () {
  return {
    type    : ARTICLE_CLEAR
  }
}
export function setArticle (name,value) {
  return {
    type    : ARTICLE_SET,
    payload : {name,value}
  }
}
export function requestColumnSelect() {
  return {
    type    : COLUMN_SELECT_REQUEST
  }
}
export function receiveColumnSelect(select) {
  return {
    type    : COLUMN_SELECT_RECEIVE,
    payload : select
  }
}
/*  This is a thunk, meaning it is a function that immediately
 returns a function for lazy evaluation. It is incredibly useful for
 creating async actions, especially when combined with redux-thunk!

 NOTE: This is solely for demonstration purposes. In a real application,
 you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 reducer take care of this logic.  */
export function fetchArticle (targetId) {
  return (dispatch, getState) => {
    dispatch(requestArticle())
    return (
      axios.get(`/nczl-web/rs/article/detail?id=${targetId}`)
      .then(function (res) {
        console.log(res);
        if(res.data.code== 1){
          dispatch(receiveArticle(res.data.result))
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    )
  }
}
export function fetchColumnSelect() {
  return (dispatch, getState) => {
    dispatch(requestColumnSelect())
    return (
      axios.get(`/nczl-web/rs/column/select`)
        .then(function (res) {
          console.log(res);
          if(res.data.code== 1){
            dispatch(receiveColumnSelect(res.data.result))
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    )
  }
}
export function editArticle () {
  return (dispatch, getState) => {
    dispatch(requestArticle())
    const {article} =getState().articleDetail;
    return (
      axios.post(`/nczl-web/rs/article/edit`, queryString.stringify( article ))
        .then(function (res) {
          console.log(res);
          if(res.data.code== 1){
            console.log('succcccc');
            //dispatch(receiveArticle(res.data.result))
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    )
  }
}
export const actions = {
  clearArticle ,
  fetchArticle ,
  setArticle,
  editArticle,
  fetchColumnSelect
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ARTICLE_REQUEST] : (state, action) => ({ ...state , fetching : true }),
  [ARTICLE_RECEIVE] : (state, action) => ({ ...state , fetching : false , article:action.payload }),
  [ARTICLE_CLEAR]   : (state, action) => ( initialState ),
  [ARTICLE_SET]     : (state, action) => {
    const {name,value} = action.payload;
    console.log("ccc",name,value)
    if(name == 'summary'){

    }
    return {
      ...state,
      [name]:value
    }
  },
  [COLUMN_SELECT_REQUEST] : (state, action) => ({ ...state , columnFetching : true }),
  [COLUMN_SELECT_RECEIVE] : (state, action) => ({ ...state , columnFetching : false , columnSelect : action.payload })
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  fetching:false,
  columnFetching : false,
  columnSelect : [],
  article:{
    title:'标题',
    author:'作者',
    status: ARTICLE_STATUS_STOP,
    stick : false,
    summary: '摘要',
    contents: '正文'
  }
}
export default function articleDetailReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
