import { GetLanguagesResponse } from "@refugies-info/api-types";
import { createReducer } from "typesafe-actions";
import { LanguagesActions } from "./languages.actions";

export interface LanguageState {
  availableLanguages: GetLanguagesResponse[];
}

export const initialLanguageState = {
  availableLanguages: [],
};

export const languagesReducer = createReducer<LanguageState, LanguagesActions>(initialLanguageState, {
  SET_LANGUAGES: (state, action) => ({
    ...state,
    availableLanguages: action.payload,
  }),
});
