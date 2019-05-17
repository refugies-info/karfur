// Store/Reducers/favoriteReducer.js
import * as actions from '../actions'

//A changer, c'est juste pour l'exemple
const initialState = { 
  languei18nCode: 'fr',
  showLanguageModal: false
}

function toggleLangue(state = initialState, action) {
  let nextState
  switch (action.type) {
    case actions.TOGGLE_LANGUE:
      nextState = {
        ...state,
        languei18nCode: action.value
      }
      return nextState || state
    case actions.TOGGLE_LANG_MODAL:
      nextState = {
        ...state,
        showLangModal: !state.showLangModal
      }
      return nextState || state
  default:
    return state
  }
}

export default toggleLangue;