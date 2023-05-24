import { RootState } from "../rootReducer";
import { GetThemeResponse, Id } from "@refugies-info/api-types";

export const themesSelector = (state: RootState): GetThemeResponse[] => state.themes.activeThemes;

export const allThemesSelector = (state: RootState): GetThemeResponse[] => [...state.themes.activeThemes, ...state.themes.inactiveThemes];

export const themeSelector = (themeId: Id | undefined) => (state: RootState) => {
  if (!themeId) return null;
  const theme = state.themes.activeThemes.find((theme) => theme._id === themeId);

  return theme || null;
};

export const secondaryThemesSelector = (themeIds: Id[] | undefined) => (state: RootState): GetThemeResponse[] => {
  if (!themeIds) return [];
  const themes = themeIds
    .map(themeId => state.themes.activeThemes.find((theme) => theme._id === themeId))
    .filter(t => t !== undefined) as GetThemeResponse[];

  return themes;
};
