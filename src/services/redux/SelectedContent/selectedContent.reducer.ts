import { Content } from "../../../types/interface";
import { SelectedContentActions } from "./selectedContent.actions";
import { createReducer } from "typesafe-actions";

export type SelectedContentState = {
  fr: Content | null;
  en: Content | null;
  ar: Content | null;
  ps: Content | null;
  fa: Content | null;
  ti: Content | null;
  ru: Content | null;
  uk: Content | null;
};

export const initialSelectedContentState = {
  fr: null,
  en: null,
  ar: null,
  ps: null,
  fa: null,
  ti: null,
  ru: null,
  uk: null,
};
export const selectedContentReducer = createReducer<
  SelectedContentState,
  SelectedContentActions
>(initialSelectedContentState, {
  SET_SELECTED_CONTENT: (state, action) => ({
    ...state,
    [action.payload.locale]: action.payload.content,
  }),
});
