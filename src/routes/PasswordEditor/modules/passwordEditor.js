/**
 * Created by admin on 2016/11/16.
 */
import axios from 'axios'
import {isArray} from 'lodash'
import queryString from 'query-string'
// ------------------------------------
// Constants
// ------------------------------------
export const PASSWORD_CHANGE_REQUEST = 'PASSWORD_CHANGE_REQUEST'
export const PASSWORD_CHANGE_RECEIVE = 'PASSWORD_CHANGE_RECEIVE'
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
export function requestPasswordChange () {
  return {
    type    : PASSWORD_CHANGE_REQUEST
  }
}
export function receivePasswordChange() {
  return {
    type    : PASSWORD_CHANGE_RECEIVE
  }
}

/*  This is a thunk, meaning it is a function that immediately
 returns a function for lazy evaluation. It is incredibly useful for
 creating async actions, especially when combined with redux-thunk!

 NOTE: This is solely for demonstration purposes. In a real application,
 you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 reducer take care of this logic.  */
export function editPassword(oldpassword,newpassword, callback) {
  return (dispatch, getState) => {
    dispatch(requestPasswordChange())
    return (
      axios.post(`/nczl-web/rs/admin/modifyPwd`, queryString.stringify({oldpassword,newpassword}))
        .then(function (res) {
          console.log(res);
          if(res.data.code== 1){
            dispatch(receivePasswordChange())
            Promise.resolve(res.data)
          }
        })
        .then(function (data) {
            if(typeof callback === 'function'){
              callback()
            }
        })
        .catch(function (error) {
          console.log(error);
        })
    )
  }
}

export const actions = {
  editPassword
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PASSWORD_CHANGE_REQUEST] : (state, action) => ({ ...state , fetching : true }),
  [PASSWORD_CHANGE_RECEIVE] : (state, action) => ({ ...state , fetching :false })
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = { fetching:false }
export default function passwordReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
