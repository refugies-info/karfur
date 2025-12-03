import type { GetDispositifResponse, Languages } from "@refugies-info/api-types";
import { type ActionType, action } from "typesafe-actions";
import { FETCH_SELECTED_CONTENT, SET_SELECTED_CONTENT } from "./selectedContent.actionTypes";

export const setSelectedContentActionCreator = (payload: {
  content: GetDispositifResponse | null;
  locale: Languages;
}) => action(SET_SELECTED_CONTENT, payload);

export const fetchSelectedContentActionCreator = (payload: {
  contentId: string;
  locale: Languages;
}) => action(FETCH_SELECTED_CONTENT, payload);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = {
  setSelectedContentActionCreator,
  fetchSelectedContentActionCreator,
};
export type SelectedContentActions = ActionType<typeof actions>;
