import type { GetThemeResponse } from "@refugies-info/api-types";
import { createReducer } from "typesafe-actions";
import type { ThemesActions } from "./themes.actions";

// separate themes here to avoid filtering at request time and improve perfs
export type ThemesState = {
  activeThemes: GetThemeResponse[];
  inactiveThemes: GetThemeResponse[];
};

const initialThemesState: ThemesState = {
  activeThemes: [],
  inactiveThemes: [],
};

export const themesReducer = createReducer<ThemesState, ThemesActions>(initialThemesState, {
  SET_THEMES: (_, action) => {
    return {
      activeThemes: action.payload.filter((t) => t.active),
      inactiveThemes: action.payload.filter((t) => !t.active),
    };
  },
});
