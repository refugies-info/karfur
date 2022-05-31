import {
  GET_WIDGETS,
  SET_WIDGETS,
  SAVE_WIDGET,
  CREATE_WIDGET,
} from "./widgets.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Widget } from "../../types/interface";

export const fetchWidgetsActionCreator = () => action(GET_WIDGETS);

export const setWidgetsActionCreator = (value: Widget[]) =>
  action(SET_WIDGETS, value);

export const saveWidgetActionCreator = (value: Partial<Widget>) =>
  action(SAVE_WIDGET, value);

export const createWidgetActionCreator = (value: Partial<Widget>) =>
  action(CREATE_WIDGET, value);

const actions = {
  fetchWidgetsActionCreator,
  setWidgetsActionCreator,
  saveWidgetActionCreator,
  createWidgetActionCreator,
};

export type WidgetsActions = ActionType<typeof actions>;
