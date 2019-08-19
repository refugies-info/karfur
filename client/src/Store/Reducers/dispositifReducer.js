import * as actions from '../actions/actionTypes'
import {updateObject} from '../utility'

const initialState = { 
  dispositifs: [],
}

function dispositifReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_DISPOSITIFS:
      return updateObject(state, { dispositifs: action.value })
  default:
    return state
  }
}

export default dispositifReducer;