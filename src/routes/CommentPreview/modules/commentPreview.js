/**
 * Created by admin on 2016/11/16.
 */
import axios from 'axios'
import {isArray} from 'lodash'
import queryString from 'query-string'
// ------------------------------------
// Constants
// ------------------------------------
export const COMMENT_LIST_REQUEST = 'COMMENT_LIST_REQUEST'
export const COMMENT_LIST_RECEIVE = 'COMMENT_LIST_RECEIVE'
export const COMMENT_LIST_CLEAR   = 'COMMENT_LIST_CLEAR'
export const COMMENT_CHECK        = 'COMMENT_CHECK'
export const COMMENT_CHECK_ALL    = 'COMMENT_CHECK_ALL'
export const COMMENT_AUDIT        = 'COMMENT_AUDIT'
export const COMMENT_AUDIT_BATCH  = 'COMMENT_AUDIT_BATCH'
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
export function requestCommentList () {
  return {
    type    : COMMENT_LIST_REQUEST
  }
}
export function receiveCommentList(page) {
  return {
    type    : COMMENT_LIST_RECEIVE,
    payload : page
  }
}
export function clearCommentList() {
  return {
    type    : COMMENT_LIST_CLEAR
  }
}
export function checkCommentById( id ) {
  return {
    type    : COMMENT_CHECK,
    payload : id
  }
}
export function checkAllComment() {
  return {
    type    : COMMENT_CHECK_ALL
  }
}

/*  This is a thunk, meaning it is a function that immediately
 returns a function for lazy evaluation. It is incredibly useful for
 creating async actions, especially when combined with redux-thunk!

 NOTE: This is solely for demonstration purposes. In a real application,
 you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 reducer take care of this logic.  */
export function fetchCommentList(targetPage) {
  return (dispatch, getState) => {
    dispatch(requestCommentList())
    return (
      axios.get(`/nczl-web/rs/comment/list?curPage=${targetPage}&pageSize=20&status=0`)
        .then(function (res) {
          console.log(res);
          if(res.data.code== 1){
            dispatch(receiveCommentList(res.data.result))
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
export function deleteComment(targetId) {
  return (dispatch, getState) => {
    console.log('getState',getState());
    return (
      axios.post('/nczl-web/rs/comment/delete', queryString.stringify({id:targetId}))
        .then(function (res) {
          console.log(res);
          if(res.data.code== 1){
            dispatch(fetchCommentList(getState().commentPreview.page.curPage))
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    )
  }
}

export function auditComment(id,status) {
  return (dispatch, getState) => {

    return (
      axios.post('/nczl-web/rs/comment/verify', queryString.stringify({ id, status }))
      .then(function (res) {
        console.log(res);
        if(res.data.code== 1){
          dispatch(fetchCommentList(getState().commentPreview.page.curPage))
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    )
  }
}
export function batchAuditComment(ids,status) {
  return (dispatch, getState) => {
    return (
      axios.post('/nczl-web/rs/comment/plverify', queryString.stringify({ ids, status }))
        .then(function (res) {
          console.log(res);
          if(res.data.code== 1){
            dispatch(fetchCommentList(getState().commentPreview.page.curPage))
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    )
  }
}

export const actions = {
  clearCommentList,
  fetchCommentList,
  deleteComment,
  checkCommentById,
  checkAllComment,
  auditComment,
  batchAuditComment
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [COMMENT_LIST_REQUEST] : (state, action) => ({ ...state , fetching : true }),
  [COMMENT_LIST_RECEIVE] : (state, action) => {
    const page = action.payload;
    var checkboxs = [];
    if (isArray(page.rowData)) {
      page.rowData.map((comment, i)=> {
        checkboxs.push({id: comment.id, checked: false});
      })
    }
    return { ...state, fetching:false, page : page, checkboxs : checkboxs, checkAll : false , checkCount : 0 }
  },
  [COMMENT_LIST_CLEAR]   : (state, action) => ( initialState ),
  [COMMENT_CHECK]        : (state, action) => {
    var { checkboxs , checkCount } = state
    var length = checkboxs.length;
    for (var i = 0; i < length; i++) {
      if (checkboxs[i].id == action.payload) {
        var checked = !checkboxs[i].checked
        checkboxs[i].checked = checked;
        checked ? checkCount++ : checkCount--;
        console.log('checkboxs', action.payload, 'change to', checked);
        break;
      }
    }
    return { ...state, checkboxs : checkboxs, checkCount : checkCount, checkAll: checkCount == length }
  },
  [COMMENT_CHECK_ALL]    : (state, action) => {
    var checked = !state.checkAll;
    var { checkboxs , checkCount } = state
    var length = checkboxs.length;
    checkCount = checked ? length : 0;
    for (var i = 0; i < length; i++) {
      checkboxs[i].checked = checked;
    }
    return ({
      ...state,
      checkAll: checked,
      checkCount: checkCount,
      checkboxs: checkboxs
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = { fetching:false , page:{} ,checkboxs:[],checkAll: false, checkCount: 0}
export default function commentPreviewReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
