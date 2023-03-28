import { SelectedContentActions } from "./selectedContent.actions";
import { createReducer } from "typesafe-actions";
import { GetDispositifResponse } from "@refugies-info/api-types";

export type SelectedContentState = {
  fr: GetDispositifResponse | null;
  en: GetDispositifResponse | null;
  ar: GetDispositifResponse | null;
  ps: GetDispositifResponse | null;
  fa: GetDispositifResponse | null;
  ti: GetDispositifResponse | null;
  ru: GetDispositifResponse | null;
  uk: GetDispositifResponse | null;
};

export const initialSelectedContentState: SelectedContentState = {
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
