import { RootState } from "../rootReducer";
import { Theme } from "../../types/interface";
import { Id } from "api-types";

export const themesSelector = (state: RootState): Theme[] => state.themes.activeThemes;

export const allThemesSelector = (state: RootState): Theme[] => [...state.themes.activeThemes, ...state.themes.inactiveThemes];

export const themeSelector = (themeId: Id | undefined) => (state: RootState) => {
  if (!themeId) return null;
  const theme = state.themes.activeThemes.find((theme) => theme._id === themeId);

  return theme || null;
};

export const secondaryThemesSelector = (themeIds: Id[] | undefined) => (state: RootState): Theme[] => {
  if (!themeIds) return [];
  const themes = themeIds
    .map(themeId => state.themes.activeThemes.find((theme) => theme._id === themeId))
    .filter(t => t !== undefined) as Theme[];

  return themes;
};
