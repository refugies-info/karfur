import { Language } from "../../../types/interface";
import { LanguagesActions } from "./languages.actions";
import { createReducer } from "typesafe-actions";

export interface LanguageState {
  availableLanguages: Language[];
}

export const initialLanguageState = {
  availableLanguages: [],
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
