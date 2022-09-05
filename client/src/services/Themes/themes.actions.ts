import {
  GET_THEMES,
  SET_THEMES,
  SAVE_THEME,
  CREATE_THEME,
  DELETE_THEME
} from "./themes.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Theme } from "../../types/interface";
import { ObjectId } from "mongodb";

export const fetchThemesActionCreator = () => action(GET_THEMES);

export const setThemesActionCreator = (value: Theme[]) =>
  action(SET_THEMES, value);

export const saveThemeActionCreator = (value: Partial<Theme>) =>
  action(SAVE_THEME, value);

export const createThemeActionCreator = (value: Partial<Theme>) =>
  action(CREATE_THEME, value);

export const deleteThemeActionCreator = (value: ObjectId) =>
    action(DELETE_THEME, value);

const actions = {
  fetchThemesActionCreator,
  setThemesActionCreator,
  saveThemeActionCreator,
  createThemeActionCreator,
  deleteThemeActionCreator,
};

export type ThemesActions = ActionType<typeof actions>;
