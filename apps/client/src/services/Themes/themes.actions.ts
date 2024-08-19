import {
  GET_THEMES,
  SET_THEMES,
  SAVE_THEME,
  CREATE_THEME,
  DELETE_THEME
} from "./themes.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { GetThemeResponse, Id, ThemeRequest } from "@refugies-info/api-types";

export const fetchThemesActionCreator = () => action(GET_THEMES);

export const setThemesActionCreator = (value: GetThemeResponse[]) =>
  action(SET_THEMES, value);

export const saveThemeActionCreator = (id: Id, value: Partial<ThemeRequest>) =>
  action(SAVE_THEME, { id, value });

export const createThemeActionCreator = (value: ThemeRequest) =>
  action(CREATE_THEME, value);

export const deleteThemeActionCreator = (value: Id) =>
  action(DELETE_THEME, value);

const actions = {
  fetchThemesActionCreator,
  setThemesActionCreator,
  saveThemeActionCreator,
  createThemeActionCreator,
  deleteThemeActionCreator,
};

export type ThemesActions = ActionType<typeof actions>;
