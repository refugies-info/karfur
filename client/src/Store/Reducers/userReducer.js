// Store/Reducers/langueReducer.js
import * as actions from '../actions/actionTypes'
import {updateObject} from '../utility'


//A changer, c'est juste pour l'exemple
const initialState = { 
  user: {},
  admin: false,
  traducteur: false,
  contributeur: false,
}

function toggleLangue(state = initialState, action) {
  switch (action.type) {
    case actions.SET_USER:
      return updateObject(state, { 
        user: action.value, 
        admin: ((action.value || {}).roles || {}).some(x=>x.nom==="Admin"), 
        traducteur: ((action.value || {}).roles || {}).some(x=>x.nom==="Trad"), 
        contributeur: ((action.value || {}).roles || {}).some(x=>x.nom==="Contrib") })
  default:
    return state
  }
}

export default toggleLangue;