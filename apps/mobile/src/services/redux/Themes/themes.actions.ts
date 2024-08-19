import { SET_THEMES, FETCH_THEMES } from "./themes.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { GetThemeResponse } from "@refugies-info/api-types";

export const setThemesActionCreator = (value: GetThemeResponse[]) =>
  action(SET_THEMES, value);

export const fetchThemesActionCreator = () => action(FETCH_THEMES);

const actions = {
  setThemesActionCreator,
  fetchThemesActionCreator,
};
export type ThemesActions = ActionType<typeof actions>;
