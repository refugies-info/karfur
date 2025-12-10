import type { GetThemeResponse, Id } from "@refugies-info/api-types";
import { createSelector } from "reselect";
import type { RootState } from "../rootReducer";

export const themesSelector = (state: RootState): GetThemeResponse[] => state.themes.activeThemes;
export const hasThemesLoadedSelector = (state: RootState): boolean => state.themes.hasLoaded;

const selectActiveThemes = (state: RootState): GetThemeResponse[] => state.themes.activeThemes;
const selectInactiveThemes = (state: RootState): GetThemeResponse[] => state.themes.inactiveThemes;
export const allThemesSelector = createSelector(
  [selectActiveThemes, selectInactiveThemes],
  (selectActiveThemes, selectInactiveThemes) => [...selectActiveThemes, ...selectInactiveThemes],
);

export const themeSelector = (themeId: Id | undefined) => (state: RootState) => {
  if (!themeId) return null;
  const theme = state.themes.activeThemes.find((theme) => theme._id === themeId);

  return theme || null;
};

export const secondaryThemesSelector =
  (themeIds: Id[] | undefined) =>
  (state: RootState): GetThemeResponse[] => {
    if (!themeIds) return [];
    const themes = themeIds
      .map((themeId) => state.themes.activeThemes.find((theme) => theme._id === themeId))
      .filter((t) => t !== undefined) as GetThemeResponse[];

    return themes;
  };
