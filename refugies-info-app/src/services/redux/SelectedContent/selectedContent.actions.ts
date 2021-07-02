import {
  SET_SELECTED_CONTENT,
  FETCH_SELECTED_CONTENT,
} from "./selectedContent.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Content, ObjectId } from "../../../types/interface";

export const setSelectedContentActionCreator = (value: Content | null) =>
  action(SET_SELECTED_CONTENT, value);

export const fetchSelectedContentActionCreator = (value: ObjectId) =>
  action(FETCH_SELECTED_CONTENT, value);

const actions = {
  setSelectedContentActionCreator,
  fetchSelectedContentActionCreator,
};
export type SelectedContentActions = ActionType<typeof actions>;
