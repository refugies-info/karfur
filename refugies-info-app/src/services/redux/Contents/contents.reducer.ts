import {
  SimplifiedContent,
  AvailableLanguageI18nCode,
} from "../../../types/interface";
import { ContentsActions } from "./contents.actions";
import { createReducer } from "typesafe-actions";

export type ContentsState = Record<
  AvailableLanguageI18nCode,
  SimplifiedContent[]
>;

export const initialContentsState = {
  fr: [],
  en: [],
  ps: [],
  "ti-ER": [],
  fa: [],
  ru: [],
  ar: [],
};

export const contentsReducer = createReducer<ContentsState, ContentsActions>(
  initialContentsState,
  {
    SET_CONTENTS: (state, action) => ({
      ...state,
      [action.payload.langue]: action.payload.contents,
    }),
  }
);
