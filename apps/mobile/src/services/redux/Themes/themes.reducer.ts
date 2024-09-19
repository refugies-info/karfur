import { GetThemeResponse } from "@refugies-info/api-types";
import { createReducer } from "typesafe-actions";
import { ThemesActions } from "./themes.actions";

export type ThemeState = GetThemeResponse[];
export const initialThemeState = [];

export const themesReducer = createReducer<ThemeState, ThemesActions>(initialThemeState, {
  SET_THEMES: (_, action) => action.payload.filter((t) => t.active),
});
