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

// Factory function to create a memoized theme selector
export const makeThemeSelector = () =>
  createSelector(
    [allThemesSelector, (_state: RootState, themeId: Id | undefined) => themeId],
    (allThemes, themeId) => {
      if (!themeId) return null;
      return allThemes.find((theme) => theme._id === themeId) || null;
    },
  );

// Factory function to create a memoized secondary themes selector
export const makeSecondaryThemesSelector = () =>
  createSelector(
    [allThemesSelector, (_state: RootState, themeIds: Id[] | undefined) => themeIds],
    (allThemes, themeIds): GetThemeResponse[] => {
      if (!themeIds) return [];
      const themes = themeIds
        .map((themeId) => allThemes.find((theme) => theme._id === themeId))
        .filter((t): t is GetThemeResponse => t !== undefined);

      return themes;
    },
  );
