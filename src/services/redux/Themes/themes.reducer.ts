import { Theme } from "../../../types/interface";
import { ThemesActions } from "./themes.actions";
import { createReducer } from "typesafe-actions";

export type ThemeState = Theme[];
export const initialThemeState = [];

export const themesReducer = createReducer<ThemeState, ThemesActions>(
  initialThemeState,
  {
    SET_THEMES: (_, action) => action.payload,
  }
);
