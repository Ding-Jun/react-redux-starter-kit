/**
 * Created by admin on 2016/11/16.
 */
import axios from 'axios'
import queryString from 'query-string'
// ------------------------------------
// Constants
// ------------------------------------
export const COLUMN_LIST_REQUEST = 'COLUMN_LIST_REQUEST'
export const COLUMN_LIST_RECEIVE = 'COLUMN_LIST_RECEIVE'
export const COLUMN_LIST_CLEAR   = 'COLUMN_LIST_CLEAR'
export const COLUMN_MODAL_OPEN   = 'COLUMN_MODAL_OPEN'
export const COLUMN_MODAL_CLOSE   = 'COLUMN_MODAL_CLOSE'
export const COLUMN_EDIT_OPTION_SET = 'COLUMN_EDIT_OPTION_SET'
export const COLUMN_EDIT_TYPE = 'edit'
export const COLUMN_ADD_TYPE = 'add'

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
export function openModal (option) {
  return {
    type    : COLUMN_MODAL_OPEN,
    payload : option
  }
}
export function closeModal() {
  return {
    type    : COLUMN_MODAL_CLOSE
  }
}
export function setEditOption(option) {
  return {
    type    : COLUMN_EDIT_OPTION_SET,
    payload : option
  }
}
/*  This is a thunk, meaning it is a function that immediately
 returns a function for lazy evaluation. It is incredibly useful for
 creating async actions, especially when combined with redux-thunk!

 NOTE: This is solely for demonstration purposes. In a real application,
 you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 reducer take care of this logic.  */
export function fetchColumnList(targetPage,callback) {
  return (dispatch, getState) => {
    dispatch(requestColumnList())
    dispatch(closeModal())
    return (
      axios.get(`/nczl-web/rs/column/list?curPage=${targetPage}&pageSize=3`)
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
export function editColumn() {
  return (dispatch, getState) => {
    const {type,value,id} = getState().columnPreview.editOption;

    return (
      axios.post(`/nczl-web/rs/column/${type}`,queryString.stringify({id,columnName:value}))
      .then(function (res) {
        console.log(res);
        if(res.data.code== 1){
          dispatch(fetchColumnList(getState().columnPreview.page.curPage))

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
      axios.post('/nczl-web/rs/column/delete', queryString.stringify({id: targetId}))
      .then(function (res) {
        console.log(res);
        if(res.data.code== 1){
          dispatch(fetchColumnList(getState().columnPreview.page.curPage))
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    )
  }
}
export const actions = {
  clearColumnList,
  fetchColumnList,
  deleteColumn,
  openModal,
  closeModal,
  setEditOption,
  editColumn
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [COLUMN_LIST_REQUEST] : (state, action) => ({ ...state , fetching : true }),
  [COLUMN_LIST_RECEIVE] : (state, action) => ({ ...state , fetching : false , page : action.payload }),
  [COLUMN_LIST_CLEAR]   : (state, action) => ( initialState ),
  [COLUMN_MODAL_OPEN] : (state, action) => ({ ...state , modalOption: { ...action.payload, visible:true} }),
  [COLUMN_MODAL_CLOSE] : (state, action) => ({ ...state , modalOption: {...state.modalOption,visible:false} }),
  [COLUMN_EDIT_OPTION_SET] : (state, action) => ({ ...state , editOption :action.payload})
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  fetching:false,
  page:{},
  editOption:{type:COLUMN_ADD_TYPE,id:null,value:''},
  modalOption:{visible:false,title:"title", content:`content`, closable:false}
}
export default function columnPreviewReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
