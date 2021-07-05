import { Content } from "../../../types/interface";
import { SelectedContentActions } from "./selectedContent.actions";
import { createReducer } from "typesafe-actions";

export type SelectedContentState = {
  fr: Content | null;
  en: Content | null;
  ar: Content | null;
  ps: Content | null;
  fa: Content | null;
  "ti-ER": Content | null;
  ru: Content | null;
};

export const initialSelectedContentState = {
  fr: null,
  en: null,
  ar: null,
  ps: null,
  fa: null,
  "ti-ER": null,
  ru: null,
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
