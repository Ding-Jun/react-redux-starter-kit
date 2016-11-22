/**S
 * Created by admin on 2016/11/16.
 */
import axios from 'axios'
import queryString from 'query-string'
import omit from 'lodash/omit'
// ------------------------------------
// Constants
// ------------------------------------
export const ARTICLE_REQUEST = 'ARTICLE_REQUEST'
export const ARTICLE_RECEIVE = 'ARTICLE_RECEIVE'
export const ARTICLE_CLEAR   = 'ARTICLE_CLEAR'
export const ARTICLE_SET     = 'ARTICLE_SET'
export const COLUMN_SELECT_RECEIVE = 'COLUMN_SELECT_RECEIVE'
export const COLUMN_SELECT_REQUEST = 'COLUMN_SELECT_REQUEST'
export const PICTURE_CROP_START = 'PICTURE_CROP_START'
export const PICTURE_CROP_END   = 'PICTURE_CROP_END'
export const ARTICLE_MODAL_OPEN = 'ARTICLE_MODAL_OPEN'
export const ARTICLE_MODAL_CLOSE = 'ARTICLE_MODAL_CLOSE'
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
export function startCropPicture() {
  return {
    type    : PICTURE_CROP_START
  }
}
export function endCropPicture() {
  return {
    type    : PICTURE_CROP_END
  }
}
export function openModal (option) {
  return {
    type    : ARTICLE_MODAL_OPEN,
    payload : option
  }
}
export function closeModal() {
  return {
    type    : ARTICLE_MODAL_CLOSE
  }
}
/*  This is a thunk, meaning it is a function that immediately
 returns a function for lazy evaluation. It is incredibly useful for
 creating async actions, especially when combined with redux-thunk!

 NOTE: This is solely for demonstration purposes. In a real application,
 you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 reducer take care of this logic.  */
export function fetchArticle (targetId,callback) {
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
      .then(function () {
        console.log('innnnnnnnnnnn',typeof callback );

        if(typeof callback === 'function'){
          console.log('hehe cakkbakc');
          callback()
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
/**
 *
 * @param type   在url里 所以传进来
 * @param content  在wangeditor里 所以传进来
 * @returns {function(*, *)}
 */
export function editArticle (type, content) {
  return (dispatch, getState) => {
    dispatch(requestArticle())
    let {articleDetail} = getState();
    const article =omit( articleDetail, ['fetching','columnFetching','columnSelect','contents']) ;
    article.content = content;
    return (
      axios.post(`/nczl-web/rs/article/${type}`, queryString.stringify( article ))
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
  fetchColumnSelect,
  startCropPicture,
  endCropPicture,
  openModal,
  closeModal
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ARTICLE_REQUEST] : (state, action) => ({ ...state , fetching : true }),
  [ARTICLE_RECEIVE] : (state, action) => ({ ...state , fetching : false , ...action.payload }),
  [ARTICLE_CLEAR]   : (state, action) => ( initialState ),
  [ARTICLE_SET]     : (state, action) => {
    let {name,value} = action.payload;
    return {
      ...state,
      [name]:value
    }
  },
  [COLUMN_SELECT_REQUEST] : (state, action) => ({ ...state , columnFetching : true }),
  [COLUMN_SELECT_RECEIVE] : (state, action) => ({ ...state , columnFetching : false , columnSelect : action.payload }),
  [PICTURE_CROP_START]    : (state, action) => ({ ...state , cropping : true }),
  [PICTURE_CROP_END]      : (state, action) => ({ ...state , cropping : false }),
  [ARTICLE_MODAL_OPEN] : (state, action) => ({ ...state , modalOption: { ...action.payload, visible:true} }),
  [ARTICLE_MODAL_CLOSE] : (state, action) => ({ ...state , modalOption: {...state.modalOption,visible:false} }),
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  fetching:false,
  columnFetching : false,
  columnSelect : [],
  title:'标题',
  author:'作者',
  columnId: 1,
  status: ARTICLE_STATUS_STOP,
  stick : 1,
  summary: '摘要',
  contents: '正文',
  modalOption:{visible:false,title:"title", content:`content`, closable:true}
}
export default function articleDetailReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
