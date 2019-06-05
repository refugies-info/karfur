import * as actions from '../actions/actionTypes'
import {updateObject} from '../utility'


//A changer, c'est juste pour l'exemple
const initialState = { 
  dispositifs: [],
}

function toggleLangue(state = initialState, action) {
  switch (action.type) {
    case actions.SET_DISPOSITIFS:
      return updateObject(state, { dispositifs: action.value })
  default:
    return state
  }
}

export default toggleLangue;