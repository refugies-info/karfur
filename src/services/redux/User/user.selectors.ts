import { RootState } from "../reducers";

export const hasUserSeenOnboardingSelector = (state: RootState) =>
  state.user.hasUserSeenOnboarding;

export const hasUserNewFavoritesSelector = (state: RootState) =>
  state.user.hasUserNewFavorites;

export const selectedI18nCodeSelector = (state: RootState) =>
  state.user.selectedLanguagei18nCode;

export const currentI18nCodeSelector = (state: RootState) =>
  state.user.currentLanguagei18nCode;

export const userLocationSelector = (state: RootState) => ({
  city: state.user.city,
  department: state.user.department,
});

export const userAgeSelector = (state: RootState) => state.user.age;
export const userFrenchLevelSelector = (state: RootState) =>
  state.user.frenchLevel;

export const userFavorites = (state: RootState) =>
  state.user.favorites;

export const isFavorite = (contentId: string) => (state: RootState) => {
  return state.user.favorites.includes(contentId);
};
