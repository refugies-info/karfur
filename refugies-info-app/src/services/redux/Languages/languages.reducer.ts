import { Language } from "../../../types/interface";
import { LanguagesActions } from "./languages.actions";
import { createReducer } from "typesafe-actions";

export interface LanguageState {
  availableLanguages: Language[];
  selectedLanguagei18nCode: string;
}

const initialLanguageState = {
  availableLanguages: [],
  selectedLanguagei18nCode: "fr",
};

export const languagesReducer = createReducer<LanguageState, LanguagesActions>(
  initialLanguageState,
  {
    SET_LANGUAGES: (state, action) => ({
      ...state,
      availableLanguages: action.payload,
    }),
  }
);
