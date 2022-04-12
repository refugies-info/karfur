import {
  SimplifiedContent,
} from "../../../types/interface";
import { ContentsActions } from "./contents.actions";
import { createReducer } from "typesafe-actions";

export type ContentsState = {
  fr: SimplifiedContent[],
  en: SimplifiedContent[],
  ps: SimplifiedContent[],
  ti: SimplifiedContent[],
  fa: SimplifiedContent[],
  ru: SimplifiedContent[],
  ar: SimplifiedContent[],
  uk: SimplifiedContent[],
  nbLocalizedContent: number|null,
  nbGlobalContent: number|null,
}

export const initialContentsState = {
  fr: [],
  en: [],
  ps: [],
  ti: [],
  fa: [],
  ru: [],
  ar: [],
  uk: [],
  nbLocalizedContent: null,
  nbGlobalContent: null,
};

export const contentsReducer = createReducer<ContentsState, ContentsActions>(
  initialContentsState,
  {
    SET_CONTENTS: (state, action) => ({
      ...state,
      [action.payload.langue]: action.payload.contents,
    }),
    SET_NB_CONTENTS: (state, action) => ({
      ...state,
      nbLocalizedContent: action.payload.nbLocalizedContent,
      nbGlobalContent: action.payload.nbGlobalContent,
    }),
  }
);
