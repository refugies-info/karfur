import { ContentForApp } from "@refugies-info/api-types";
import { ContentsActions } from "./contents.actions";
import { createReducer } from "typesafe-actions";

export type ContentsState = {
  fr: ContentForApp[];
  en: ContentForApp[];
  ps: ContentForApp[];
  ti: ContentForApp[];
  fa: ContentForApp[];
  ru: ContentForApp[];
  ar: ContentForApp[];
  uk: ContentForApp[];
  nbLocalizedContent: number | null;
  nbGlobalContent: number | null;
};

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
