import { createReducer } from "typesafe-actions";
import { Theme } from "../../types/interface";
import { ThemesActions } from "./themes.actions";

// separate themes here to avoid filtering at request time and improve perfs
export type ThemesState = {
  activeThemes: Theme[],
  inactiveThemes: Theme[],
};

const initialThemesState: ThemesState = {
  activeThemes: [],
  inactiveThemes: [],
}

export const themesReducer = createReducer<ThemesState, ThemesActions>(
  initialThemesState,
  {
    SET_THEMES: (_, action) => {
      return {
        activeThemes: action.payload.filter(t => t.active),
        inactiveThemes: action.payload.filter(t => !t.active),
      }
    },
  }
);
