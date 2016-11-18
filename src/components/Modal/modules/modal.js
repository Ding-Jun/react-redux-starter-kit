/**
 * Created by admin on 2016/11/16.
 */
// ------------------------------------
// Constants
// ------------------------------------
export const MODAL_OPEN = 'MODAL_OPEN'
export const MODAL_CLOSE = 'MODAL_CLOSE'

// ------------------------------------
// Actions
// ------------------------------------
export function openModal (option) {
  return {
    type    : MODAL_OPEN,
    payload : option
  }
}
export function closeModal() {
  return {
    type    : MODAL_CLOSE
  }
}
export const actions = {
  openModal,
  closeModal
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [MODAL_OPEN] : (state, action) => ({ ...state , ...action.payload , visible:true }),
  [MODAL_CLOSE] : (state, action) => ( initialState )
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {visible:false,title:"title", content:`content2`, closable:false, onOk:()=>{console.log('hehe')}}
export default function modalReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
