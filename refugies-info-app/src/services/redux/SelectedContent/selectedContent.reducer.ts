import { Content } from "../../../types/interface";
import { SelectedContentActions } from "./selectedContent.actions";
import { createReducer } from "typesafe-actions";

export interface SelectedContentState {
  selectedContent: Content | null;
}

export const initialSelectedContentState = {
  selectedContent: null,
};

export const selectedContentReducer = createReducer<
  SelectedContentState,
  SelectedContentActions
>(initialSelectedContentState, {
  SET_SELECTED_CONTENT: (state, action) => ({
    ...state,
    selectedContent: action.payload,
  }),
});
