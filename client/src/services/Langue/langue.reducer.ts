import { Language } from "types/interface";
import { LangueActions } from "./langue.actions";
import { createReducer } from "typesafe-actions";

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
      // @ts-ignore
      localStorage.setItem("languei18nCode", action.payload);
      return { ...state, languei18nCode: action.payload };
    },
    TOGGLE_LANG_MODAL: (state) =>
      ({...state, showLangModal: !state.showLangModal }),
    SET_LANGUES: (state, action) =>
      ({...state, langues: action.payload }),
  }
);
