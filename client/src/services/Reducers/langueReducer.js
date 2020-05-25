// Store/Reducers/langueReducer.js
import Cookies from "js-cookie";

import {
  TOGGLE_LANGUE,
  TOGGLE_LANG_MODAL,
  SET_LANGUES,
} from "../Langue/langue.actionTypes";
import { updateObject } from "../utility";

//A changer, c'est juste pour l'exemple
const initialState = {
  langues: [],
  languei18nCode: "fr",
  showLanguageModal: false,
};

function langueReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_LANGUE:
      Cookies.set("languei18nCode", action.value);
      return updateObject(state, { languei18nCode: action.value });
    case TOGGLE_LANG_MODAL:
      return updateObject(state, { showLangModal: !state.showLangModal });
    case SET_LANGUES:
      return updateObject(state, { langues: action.value });
    default:
      return state;
  }
}

export default langueReducer;
