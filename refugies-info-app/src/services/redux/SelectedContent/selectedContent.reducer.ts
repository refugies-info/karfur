import { Content } from "../../../types/interface";
import { SelectedContentActions } from "./selectedContent.actions";
import { createReducer } from "typesafe-actions";

// to do : store fr and language selected
// add param langue to fetch selected content
export type SelectedContentState = Content | null;

export const initialSelectedContentState = null;

export const selectedContentReducer = createReducer<
  SelectedContentState,
  SelectedContentActions
>(initialSelectedContentState, {
  SET_SELECTED_CONTENT: (_, action) => action.payload,
});
