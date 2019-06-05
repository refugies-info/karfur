// Store/Reducers/langueReducer.js
import Cookies from 'js-cookie';

import * as actions from '../actions/actionTypes'
import {updateObject} from '../utility'


//A changer, c'est juste pour l'exemple
const initialState = { 
  langues: [],
  languei18nCode: 'fr',
  showLanguageModal: false,
}

function langueReducer(state = initialState, action) {
  switch (action.type) {
    case actions.TOGGLE_LANGUE:
      Cookies.set('languei18nCode',action.value)
      return updateObject(state, { languei18nCode: action.value })
    case actions.TOGGLE_LANG_MODAL:
      return updateObject(state, { showLangModal: !state.showLangModal })
    case actions.SET_LANGUES:
      return updateObject(state, { langues: action.value })
  default:
    return state
  }
}

export default langueReducer;