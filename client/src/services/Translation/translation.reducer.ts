import { Translation } from "../../types/interface";
import { createReducer } from "typesafe-actions";
import { TranslationActions } from "./translation.actions";

export interface TranslationState {
  translation: Translation;
  translations: Translation[];
}
const initialTranslationState = {
  translation: {
    initialText: {},
    translatedText: {},
  },
  translations: [],
};

export const translationReducer = createReducer<
  TranslationState,
  TranslationActions
>(initialTranslationState, {
  SET_TRANSLATION: (state, action) =>
    ({...state, translation: action.payload }),
  SET_TRANSLATIONS: (state, action) =>
    ({...state, translations: action.payload }),
});
