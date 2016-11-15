/**
 * Created by admin on 2016/11/10.
 */
// ------------------------------------
// Constants
// ------------------------------------
export const ZEN_REQUEST = 'ZEN_REQUEST'
export const ZEN_RECIEVE = 'ZEN_RECIEVE'
export const ZEN_SAVE_CURRENT = 'ZEN_SAVE_CURRENT'
// ------------------------------------
// Actions
// ------------------------------------
export function requestZen () {
  return {
    type: ZEN_REQUEST
  }
}

let availableId = 0

export function recieveZen (value) {
  return {
    type: ZEN_RECIEVE,
    payload: {
      value,
      id: availableId++
    }
  }
}

export function saveCurrentZen () {
  return {
    type: ZEN_SAVE_CURRENT
  }
}

export function fetchZen () {
  return (dispatch, getState) => {
    dispatch(requestZen())
    return fetch('https://api.github.com/zen')
      .then(data => data.text())
      .then(text => dispatch(recieveZen(text)))
  }
}

/*  This is a thunk, meaning it is a function that immediately
 returns a function for lazy evaluation. It is incredibly useful for
 creating async actions, especially when combined with redux-thunk!

 NOTE: This is solely for demonstration purposes. In a real application,
 you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 reducer take care of this logic.  */
/*
 export const doubleAsync = () => {
 return (dispatch, getState) => {
 return new Promise((resolve) => {
 setTimeout(() => {
 dispatch(increment(getState().zen*3))
 resolve()
 }, 200)
 })
 }
 }
 */

export const actions = {
  requestZen,
  recieveZen,
  fetchZen,
  saveCurrentZen
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ZEN_REQUEST]: (state, action) => ({ ...state, fetching: true }),
  [ZEN_RECIEVE]: (state, action) => ({
    ...state,
    zens: state.zens.concat(action.payload),
    current: action.payload.id,
    fetching: false
  }),
  [ZEN_SAVE_CURRENT]: (state, action) => (state.current != null ? ({
    ...state,
    saved: state.saved.concat(state.current)
  }) : state)
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  current: null,
  fetching: false,
  zens: [],
  saved: []
}
export default function zenReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
