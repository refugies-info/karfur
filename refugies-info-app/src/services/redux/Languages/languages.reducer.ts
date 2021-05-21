import { Language } from "../../../types/interface";
import { LanguagesActions } from "./languages.actions";
import { createReducer } from "typesafe-actions";

export interface LanguageState {
  availableLanguages: Language[];
  selectedLanguagei18nCode: string | null;
}

export const initialLanguageState = {
  availableLanguages: [],
  selectedLanguagei18nCode: null,
};

export const languagesReducer = createReducer<LanguageState, LanguagesActions>(
  initialLanguageState,
  {
    SET_LANGUAGES: (state, action) => ({
      ...state,
      availableLanguages: action.payload,
    }),
    SET_SELECTED_LANGUAGE: (state, action) => ({
      ...state,
      selectedLanguagei18nCode: action.payload,
    }),
  }
);
