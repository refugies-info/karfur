import { action, ActionType } from "typesafe-actions";
import {
  SET_SELECTED_LANGUAGE,
  SAVE_SELECTED_LANGUAGE,
  SET_CURRENT_LANGUAGE,
  SAVE_USER_LOCATION,
  SET_USER_LOCATION,
  SAVE_USER_AGE,
  SAVE_USER_FRENCH_LEVEL,
  SET_USER_AGE,
  SET_USER_FRENCH_LEVEL,
  SET_USER_HAS_SEEN_ONBOARDING,
  SAVE_USER_HAS_SEEN_ONBOARDING,
  SET_USER_HAS_NEW_FAVORITES,
  SAVE_USER_HAS_NEW_FAVORITES,
  SET_USER_LOCALIZED_WARNING_HIDDEN,
  SAVE_USER_LOCALIZED_WARNING_HIDDEN,
  GET_USER_INFOS,
  REMOVE_USER_HAS_SEEN_ONBOARDING,
  REMOVE_USER_HAS_NEW_FAVORITES,
  REMOVE_SELECTED_LANGUAGE,
  REMOVE_USER_AGE,
  REMOVE_USER_LOCATION,
  REMOVE_USER_FRENCH_LEVEL,
  SET_USER_FAVORITES,
  ADD_USER_FAVORITE,
  REMOVE_USER_FAVORITE,
  REMOVE_USER_ALL_FAVORITES,
  REMOVE_USER_LOCALIZED_WARNING_HIDDEN
} from "./user.actionTypes";
import { AvailableLanguageI18nCode } from "../../../types/interface";

export const setHasUserSeenOnboardingActionCreator = (value: boolean) =>
  action(SET_USER_HAS_SEEN_ONBOARDING, value);

export const saveHasUserSeenOnboardingActionCreator = () =>
  action(SAVE_USER_HAS_SEEN_ONBOARDING);

export const removeHasUserSeenOnboardingActionCreator = () =>
  action(REMOVE_USER_HAS_SEEN_ONBOARDING);

export const setUserHasNewFavoritesActionCreator = (value: boolean) =>
  action(SET_USER_HAS_NEW_FAVORITES, value);

export const saveUserHasNewFavoritesActionCreator = () =>
  action(SAVE_USER_HAS_NEW_FAVORITES);

export const removeUserHasNewFavoritesActionCreator = () =>
  action(REMOVE_USER_HAS_NEW_FAVORITES);

export const setUserLocalizedWarningHiddenActionCreator = (value: boolean) =>
  action(SET_USER_LOCALIZED_WARNING_HIDDEN, value);

export const saveUserLocalizedWarningHiddenActionCreator = () =>
  action(SAVE_USER_LOCALIZED_WARNING_HIDDEN);

export const removeUserLocalizedWarningHiddenActionCreator = () =>
  action(REMOVE_USER_LOCALIZED_WARNING_HIDDEN);

export const setSelectedLanguageActionCreator = (
  value: AvailableLanguageI18nCode | null
) => action(SET_SELECTED_LANGUAGE, value);

export const saveSelectedLanguageActionCreator = (value: {
  langue: AvailableLanguageI18nCode;
  shouldFetchContents: boolean;
}) => action(SAVE_SELECTED_LANGUAGE, value);

export const removeSelectedLanguageActionCreator = () =>
  action(REMOVE_SELECTED_LANGUAGE);

export const saveUserLocationActionCreator = (value: {
  city: string;
  dep: string;
  shouldFetchContents: boolean;
}) => action(SAVE_USER_LOCATION, value);

export const setUserLocationActionCreator = (value: {
  city: string | null;
  dep: string | null;
}) => action(SET_USER_LOCATION, value);

export const removeUserLocationActionCreator = (shouldFetchContents: boolean) =>
  action(REMOVE_USER_LOCATION, shouldFetchContents);

export const saveUserAgeActionCreator = (value: {
  age: string;
  shouldFetchContents: boolean;
}) => action(SAVE_USER_AGE, value);

export const setUserAgeActionCreator = (value: string | null) =>
  action(SET_USER_AGE, value);

export const removeUserAgeActionCreator = (shouldFetchContents: boolean) =>
  action(REMOVE_USER_AGE, shouldFetchContents);

export const saveUserFrenchLevelActionCreator = (value: {
  frenchLevel: string;
  shouldFetchContents: boolean;
}) => action(SAVE_USER_FRENCH_LEVEL, value);

export const setUserFrenchLevelActionCreator = (value: string | null) =>
  action(SET_USER_FRENCH_LEVEL, value);

export const removeUserFrenchLevelActionCreator = (
  shouldFetchContents: boolean
) => action(REMOVE_USER_FRENCH_LEVEL, shouldFetchContents);

export const setCurrentLanguageActionCreator = (
  value: AvailableLanguageI18nCode | null
) => action(SET_CURRENT_LANGUAGE, value);

export const getUserInfosActionCreator = () => action(GET_USER_INFOS);

export const setUserFavoritesActionCreator = (
  contentIds: string[]
) => action(SET_USER_FAVORITES, contentIds);

export const addUserFavoriteActionCreator = (
  contentId: string
) => action(ADD_USER_FAVORITE, contentId);

export const removeUserFavoriteActionCreator = (
  contentId: string
) => action(REMOVE_USER_FAVORITE, contentId);

export const removeUserAllFavoritesActionCreator = () =>
  action(REMOVE_USER_ALL_FAVORITES);

const actions = {
  setHasUserSeenOnboardingActionCreator,
  setSelectedLanguageActionCreator,
  saveSelectedLanguageActionCreator,
  saveHasUserSeenOnboardingActionCreator,
  setUserHasNewFavoritesActionCreator,
  setUserLocalizedWarningHiddenActionCreator,
  setCurrentLanguageActionCreator,
  setUserAgeActionCreator,
  setUserLocationActionCreator,
  setUserFrenchLevelActionCreator,
  saveUserAgeActionCreator,
  saveUserLocationActionCreator,
  saveUserFrenchLevelActionCreator,
  saveUserLocalizedWarningHiddenActionCreator,
  getUserInfosActionCreator,
  removeHasUserSeenOnboardingActionCreator,
  removeSelectedLanguageActionCreator,
  removeUserAgeActionCreator,
  removeUserFrenchLevelActionCreator,
  removeUserLocationActionCreator,
  removeUserLocalizedWarningHiddenActionCreator,
  setUserFavoritesActionCreator,
  addUserFavoriteActionCreator,
  removeUserFavoriteActionCreator,
  removeUserAllFavoritesActionCreator
};
export type UserActions = ActionType<typeof actions>;
