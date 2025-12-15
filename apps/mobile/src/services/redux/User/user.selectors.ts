import type { Languages } from "@refugies-info/api-types";
import { createSelector } from "reselect";
import type { RootState } from "../reducers";

export const hasUserSeenOnboardingSelector = (state: RootState) => state.user.hasUserSeenOnboarding;

export const hasUserNewFavoritesSelector = (state: RootState) => state.user.hasUserNewFavorites;

export const selectedI18nCodeSelector = (state: RootState): Languages | null =>
  state.user.selectedLanguagei18nCode;

export const currentI18nCodeSelector = (state: RootState): Languages | null =>
  state.user.currentLanguagei18nCode;

const selectUser = (state: RootState) => state.user;

export const userLocationSelector = createSelector([selectUser], (user) => ({
  city: user.city,
  department: user.department,
}));

export const userAgeSelector = (state: RootState) => state.user.age;
export const userFrenchLevelSelector = (state: RootState) => state.user.frenchLevel;

export const userFavorites = (state: RootState) => state.user.favorites;

export const isFavorite = (contentId: string) => (state: RootState) => {
  return state.user.favorites.includes(contentId);
};
export const isLocalizedWarningHiddenSelector = (state: RootState) =>
  state.user.localizedWarningHidden;

export const isInitialUrlUsedSelector = (state: RootState) => state.user.initialUrlUsed;

export const initialUrlSelector = (state: RootState) => state.user.initialUrl;

export const redirectDispositifSelector = (state: RootState) => state.user.redirectDispositif;

export const shouldLoadContentSelector = (state: RootState) =>
  state.user.hasUserSeenOnboarding || !!state.user.initialUrl;
