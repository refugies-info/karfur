import { LangueActions } from "./langue.actions";
import { createReducer } from "typesafe-actions";
import locale from "utils/locale";
import { GetLanguagesResponse } from "@refugies-info/api-types";

export interface LangueState {
  langues: GetLanguagesResponse[];
  languei18nCode: string;
  showLanguageModal: boolean;
  showLangModal: boolean;
}

const initialLangueState = {
  langues: [],
  languei18nCode: "fr",
  showLanguageModal: false,
  showLangModal: false
};

export const langueReducer = createReducer<LangueState, LangueActions>(initialLangueState, {
  TOGGLE_LANGUE: (state, action) => {
    locale.saveInCache(action.payload);
    return { ...state, languei18nCode: action.payload };
  },
  TOGGLE_LANG_MODAL: (state) => ({ ...state, showLangModal: !state.showLangModal }),
  SET_LANGUES: (state, action) => ({ ...state, langues: action.payload })
});
