import { Language } from "../../../types/interface";
import { LanguagesActions } from "./languages.actions";
import { createReducer } from "typesafe-actions";

export interface LanguageState {
  languages: Language[];
  selectedLanguagei18nCode: string;
}

const initialLanguageState = {
  languages: [],
  selectedLanguagei18nCode: "fr",
};

export const languagesReducer = createReducer<LanguageState, LanguagesActions>(
  initialLanguageState,
  {
    SET_LANGUAGES: (state, action) => ({ ...state, languages: action.payload }),
  }
);
