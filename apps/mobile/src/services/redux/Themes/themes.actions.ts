import type { GetThemeResponse } from "@refugies-info/api-types";
import { type ActionType, action } from "typesafe-actions";
import { FETCH_THEMES, SET_THEMES } from "./themes.actionTypes";

export const setThemesActionCreator = (value: GetThemeResponse[]) => action(SET_THEMES, value);

export const fetchThemesActionCreator = () => action(FETCH_THEMES);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = {
  setThemesActionCreator,
  fetchThemesActionCreator,
};
export type ThemesActions = ActionType<typeof actions>;
