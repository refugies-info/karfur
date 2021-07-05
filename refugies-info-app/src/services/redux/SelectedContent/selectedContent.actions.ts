import {
  SET_SELECTED_CONTENT,
  FETCH_SELECTED_CONTENT,
} from "./selectedContent.actionTypes";
import { action, ActionType } from "typesafe-actions";
import {
  Content,
  ObjectId,
  AvailableLanguageI18nCode,
} from "../../../types/interface";

export const setSelectedContentActionCreator = (payload: {
  content: Content | null;
  locale: AvailableLanguageI18nCode;
}) => action(SET_SELECTED_CONTENT, payload);

export const fetchSelectedContentActionCreator = (payload: {
  contentId: ObjectId;
  locale: AvailableLanguageI18nCode;
}) => action(FETCH_SELECTED_CONTENT, payload);

const actions = {
  setSelectedContentActionCreator,
  fetchSelectedContentActionCreator,
};
export type SelectedContentActions = ActionType<typeof actions>;
