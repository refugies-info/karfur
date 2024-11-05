import { GetThemeResponse, Id, ThemeRequest } from "@refugies-info/api-types";
import { action, ActionType } from "typesafe-actions";
import { CREATE_THEME, DELETE_THEME, GET_THEMES, SAVE_THEME, SET_THEMES } from "./themes.actionTypes";

export const fetchThemesActionCreator = () => action(GET_THEMES);

export const setThemesActionCreator = (value: GetThemeResponse[]) => action(SET_THEMES, value);

export const saveThemeActionCreator = (id: Id, value: Partial<ThemeRequest>) => action(SAVE_THEME, { id, value });

export const createThemeActionCreator = (value: ThemeRequest) => action(CREATE_THEME, value);

export const deleteThemeActionCreator = (value: Id) => action(DELETE_THEME, value);

const actions = {
  fetchThemesActionCreator,
  setThemesActionCreator,
  saveThemeActionCreator,
  createThemeActionCreator,
  deleteThemeActionCreator,
};

export type ThemesActions = ActionType<typeof actions>;
