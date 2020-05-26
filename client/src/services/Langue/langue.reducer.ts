// Store/Reducers/langueReducer.js
import Cookies from "js-cookie";
import { updateObject } from "../utility";
import { Language } from "../../@types/interface";
import { LangueActions } from "./langue.actions";
import { createReducer, action } from "typesafe-actions";

export interface LangueState {
  langues: Language[];
  languei18nCode: string;
  showLanguageModal: boolean;
  showLangModal: boolean;
}

const initialLangueState = {
  langues: [],
  languei18nCode: "fr",
  showLanguageModal: false,
  showLangModal: false,
};

export const langueReducer = createReducer<LangueState, LangueActions>(
  initialLangueState,
  {
    TOGGLE_LANGUE: (state, action) => {
      Cookies.set("languei18nCode", action.payload);
      return updateObject(state, { languei18nCode: action.payload });
    },
    TOGGLE_LANG_MODAL: (state, action) =>
      updateObject(state, { showLangModal: !state.showLangModal }),
    SET_LANGUES: (state, action) =>
      updateObject(state, { langues: action.payload }),
  }
);
