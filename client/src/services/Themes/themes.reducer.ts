import { createReducer } from "typesafe-actions";
import { Theme } from "../../types/interface";
import { ThemesActions } from "./themes.actions";

export type ThemesState = Theme[];

const initialThemesState: ThemesState = [];

export const themesReducer = createReducer<ThemesState, ThemesActions>(
  initialThemesState,
  {
    SET_THEMES: (_, action) => action.payload,
  }
);
