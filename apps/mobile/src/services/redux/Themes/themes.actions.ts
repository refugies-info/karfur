import { GetThemeResponse } from "@refugies-info/api-types";
import { action, ActionType } from "typesafe-actions";
import { FETCH_THEMES, SET_THEMES } from "./themes.actionTypes";

export const setThemesActionCreator = (value: GetThemeResponse[]) => action(SET_THEMES, value);

export const fetchThemesActionCreator = () => action(FETCH_THEMES);

const actions = {
  setThemesActionCreator,
  fetchThemesActionCreator,
};
export type ThemesActions = ActionType<typeof actions>;
