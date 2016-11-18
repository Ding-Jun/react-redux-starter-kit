/**
 * Created by admin on 2016/11/16.
 */
import axios from 'axios'
// ------------------------------------
// Constants
// ------------------------------------
export const ARTICLE_LIST_REQUEST = 'ARTICLE_LIST_REQUEST'
export const ARTICLE_LIST_RECEIVE = 'ARTICLE_LIST_RECEIVE'
export const ARTICLE_LIST_CLEAR   = 'ARTICLE_LIST_CLEAR'
export const SEARCH_VALUE_SET     = 'ARTICLE_SEARCH_VALUE_SET'
export const ARTICLE_QUERY_SET    = 'ARTICLE_QUERY_SET'
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
export function requestArticleList () {
  return {
    type    : ARTICLE_LIST_REQUEST
  }
}
export function receiveArticleList(page) {
  return {
    type    : ARTICLE_LIST_RECEIVE,
    payload : page
  }
}
export function clearArticleList() {
  return {
    type    : ARTICLE_LIST_CLEAR
  }
}
export function setSearchValue(value) {
  return {
    type    : SEARCH_VALUE_SET,
    payload : value
  }
}
export function setQuery(query) {
  return {
    type    : ARTICLE_QUERY_SET,
    payload : query
  }
}
/*  This is a thunk, meaning it is a function that immediately
 returns a function for lazy evaluation. It is incredibly useful for
 creating async actions, especially when combined with redux-thunk!

 NOTE: This is solely for demonstration purposes. In a real application,
 you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 reducer take care of this logic.  */
export function fetchArticleList(targetPage,query) {
  return (dispatch, getState) => {
    var payload=getState().articlePreview.query;
    if(query){
      payload = query;
      dispatch(setQuery(query));
    }
    console.log('query',query);
    var queryString='';
    for(var arg in query){
      if(query[arg]){queryString+=`&${arg}=${payload[arg]}`}
    }
    console.log('queryString',queryString);
    dispatch(requestArticleList())
    return (
      axios.get(`/nczl-web/rs/article/list?curPage=${targetPage}&pageSize=20${queryString}`)
      .then(function (res) {
        console.log(res);
        if(res.data.code== 1){
          dispatch(receiveArticleList(res.data.result))
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    )
  }
}
export function deleteArticle(targetId) {
  return (dispatch, getState) => {
    console.log('getState',getState());
    return (
      axios.post('/nczl-web/rs/article/delete', {
        params: {
          id: targetId
        }
      })
      .then(function (res) {
        console.log(res);
        if(res.data.code== 1){
          dispatch(fetchArticleList(getState().articlePreview.page.curPage))
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    )
  }
}
export const actions = {
  clearArticleList,
  fetchArticleList,
  deleteArticle,
  setSearchValue,
  setQuery
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ARTICLE_LIST_REQUEST] : (state, action) => ({ ...state , fetching : true }),
  [ARTICLE_LIST_RECEIVE] : (state, action) => ({ ...state , fetching : false , page : action.payload }),
  [ARTICLE_LIST_CLEAR]   : (state, action) => ({ ...state , fetching : false , page : {} }),
  [SEARCH_VALUE_SET]     : (state, action) => ({ ...state , searchValue : action.payload}),
  [ARTICLE_QUERY_SET]    : (state, action) => ({ ...state , query : action.payload })
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {fetching:false,page:{},searchValue:'',query:{columnId:null,title:''}}
export default function articlePreviewReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
