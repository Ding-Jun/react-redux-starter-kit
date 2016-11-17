/**
 * Created by admin on 2016/11/16.
 */
import axios from 'axios'
// ------------------------------------
// Constants
// ------------------------------------
export const COLUMN_LIST_REQUEST = 'COLUMN_LIST_REQUEST'
export const COLUMN_LIST_RECEIVE = 'COLUMN_LIST_RECEIVE'
export const COLUMN_LIST_CLEAR   = 'COLUMN_LIST_CLEAR'

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
export function requestColumnList () {
  return {
    type    : COLUMN_LIST_REQUEST
  }
}
export function receiveColumnList(page) {
  return {
    type    : COLUMN_LIST_RECEIVE,
    payload : page
  }
}
export function clearColumnList() {
  return {
    type    : COLUMN_LIST_CLEAR
  }
}

/*  This is a thunk, meaning it is a function that immediately
 returns a function for lazy evaluation. It is incredibly useful for
 creating async actions, especially when combined with redux-thunk!

 NOTE: This is solely for demonstration purposes. In a real application,
 you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 reducer take care of this logic.  */
export function fetchColumnList(targetPage) {
  return (dispatch, getState) => {
    dispatch(requestColumnList())
    return (
      axios.get(`/nczl-web/rs/column/list?curPage=${targetPage}&pageSize=20`)
        .then(function (res) {
          console.log(res);
          if(res.data.code== 1){
            dispatch(receiveColumnList(res.data.result))
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    )
  }
}
export function deleteColumn(targetId) {
  return (dispatch, getState) => {
    console.log('getState',getState());
    return (
      axios.post('/nczl-web/rs/column/delete', {
        params: {
          id: targetId
        }
      })
        .then(function (res) {
          console.log(res);
          if(res.data.code== 1){
            dispatch(fetchColumnList(getState().articlePreview.page.curPage))
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    )
  }
}
export const actions = {
  requestColumnList,
  receiveColumnList,
  clearColumnList,
  fetchColumnList,
  deleteColumn
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [COLUMN_LIST_REQUEST] : (state, action) => ({ ...state , fetching : true }),
  [COLUMN_LIST_RECEIVE] : (state, action) => ({ ...state , fetching : false , page : action.payload }),
  [COLUMN_LIST_CLEAR]   : (state, action) => ({ ...state , fetching : false , page : [] })
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {fetching:false,page:{}}
export default function columnPreviewReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
