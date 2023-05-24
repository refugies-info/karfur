import {
  GET_WIDGETS,
  SET_WIDGETS,
  SAVE_WIDGET,
  CREATE_WIDGET,
  DELETE_WIDGET
} from "./widgets.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { GetWidgetResponse, Id, WidgetRequest } from "@refugies-info/api-types";

export const fetchWidgetsActionCreator = () => action(GET_WIDGETS);

export const setWidgetsActionCreator = (value: GetWidgetResponse[]) =>
  action(SET_WIDGETS, value);

export const saveWidgetActionCreator = (id: Id, value: Partial<WidgetRequest>) =>
  action(SAVE_WIDGET, { id, value });

export const createWidgetActionCreator = (value: WidgetRequest) =>
  action(CREATE_WIDGET, value);

export const deleteWidgetActionCreator = (value: Id) =>
  action(DELETE_WIDGET, value);

const actions = {
  fetchWidgetsActionCreator,
  setWidgetsActionCreator,
  saveWidgetActionCreator,
  createWidgetActionCreator,
  deleteWidgetActionCreator,
};

export type WidgetsActions = ActionType<typeof actions>;
