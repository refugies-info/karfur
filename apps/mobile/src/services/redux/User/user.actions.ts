import { GetContentsForAppRequest, GetThemeResponse, Languages, MobileFrenchLevel } from "@refugies-info/api-types";
import { action, ActionType } from "typesafe-actions";
import { ObjectId } from "~/types/interface";
import {
  ADD_USER_FAVORITE,
  GET_USER_INFOS,
  REMOVE_SELECTED_LANGUAGE,
  REMOVE_USER_AGE,
  REMOVE_USER_ALL_FAVORITES,
  REMOVE_USER_FAVORITE,
  REMOVE_USER_FRENCH_LEVEL,
  REMOVE_USER_HAS_NEW_FAVORITES,
  REMOVE_USER_HAS_SEEN_ONBOARDING,
  REMOVE_USER_LOCALIZED_WARNING_HIDDEN,
  REMOVE_USER_LOCATION,
  RESET_USER,
  SAVE_SELECTED_LANGUAGE,
  SAVE_USER_AGE,
  SAVE_USER_FRENCH_LEVEL,
  SAVE_USER_HAS_NEW_FAVORITES,
  SAVE_USER_HAS_SEEN_ONBOARDING,
  SAVE_USER_LOCALIZED_WARNING_HIDDEN,
  SAVE_USER_LOCATION,
  SET_CURRENT_LANGUAGE,
  SET_INITIAL_URL,
  SET_INITIAL_URL_USED,
  SET_REDIRECT_DISPOSITIF,
  SET_SELECTED_LANGUAGE,
  SET_USER_AGE,
  SET_USER_FAVORITES,
  SET_USER_FRENCH_LEVEL,
  SET_USER_HAS_NEW_FAVORITES,
  SET_USER_HAS_SEEN_ONBOARDING,
  SET_USER_LOCALIZED_WARNING_HIDDEN,
  SET_USER_LOCATION,
} from "./user.actionTypes";

export const setHasUserSeenOnboardingActionCreator = (value: boolean) => action(SET_USER_HAS_SEEN_ONBOARDING, value);

export const saveHasUserSeenOnboardingActionCreator = () => action(SAVE_USER_HAS_SEEN_ONBOARDING);

export const removeHasUserSeenOnboardingActionCreator = () => action(REMOVE_USER_HAS_SEEN_ONBOARDING);

export const setUserHasNewFavoritesActionCreator = (value: boolean) => action(SET_USER_HAS_NEW_FAVORITES, value);

export const saveUserHasNewFavoritesActionCreator = () => action(SAVE_USER_HAS_NEW_FAVORITES);

export const removeUserHasNewFavoritesActionCreator = () => action(REMOVE_USER_HAS_NEW_FAVORITES);

export const setUserLocalizedWarningHiddenActionCreator = (value: boolean) =>
  action(SET_USER_LOCALIZED_WARNING_HIDDEN, value);

export const saveUserLocalizedWarningHiddenActionCreator = () => action(SAVE_USER_LOCALIZED_WARNING_HIDDEN);

export const removeUserLocalizedWarningHiddenActionCreator = () => action(REMOVE_USER_LOCALIZED_WARNING_HIDDEN);

export const setInitialUrlUsed = (value: boolean) => action(SET_INITIAL_URL_USED, value);

export const setInitialUrlActionCreator = (value: string | null) => action(SET_INITIAL_URL, value);

export const setRedirectDispositifActionCreator = (
  value: {
    needId: ObjectId;
    contentId: ObjectId;
    theme: GetThemeResponse;
  } | null,
) => action(SET_REDIRECT_DISPOSITIF, value);

export const setSelectedLanguageActionCreator = (value: Languages | null) => action(SET_SELECTED_LANGUAGE, value);

export const saveSelectedLanguageActionCreator = (value: { langue: Languages; shouldFetchContents: boolean }) =>
  action(SAVE_SELECTED_LANGUAGE, value);

export const removeSelectedLanguageActionCreator = () => action(REMOVE_SELECTED_LANGUAGE);

export const saveUserLocationActionCreator = (value: { city: string; dep: string; shouldFetchContents: boolean }) =>
  action(SAVE_USER_LOCATION, value);

export const setUserLocationActionCreator = (value: { city: string | null; dep: string | null }) =>
  action(SET_USER_LOCATION, value);

export const removeUserLocationActionCreator = (shouldFetchContents: boolean) =>
  action(REMOVE_USER_LOCATION, shouldFetchContents);

export const saveUserAgeActionCreator = (value: {
  age: GetContentsForAppRequest["age"];
  shouldFetchContents: boolean;
}) => action(SAVE_USER_AGE, value);

export const setUserAgeActionCreator = (value: GetContentsForAppRequest["age"] | null) => action(SET_USER_AGE, value);

export const removeUserAgeActionCreator = (shouldFetchContents: boolean) =>
  action(REMOVE_USER_AGE, shouldFetchContents);

export const saveUserFrenchLevelActionCreator = (value: {
  frenchLevel: MobileFrenchLevel;
  shouldFetchContents: boolean;
}) => action(SAVE_USER_FRENCH_LEVEL, value);

export const setUserFrenchLevelActionCreator = (value: MobileFrenchLevel | null) =>
  action(SET_USER_FRENCH_LEVEL, value);

export const removeUserFrenchLevelActionCreator = (shouldFetchContents: boolean) =>
  action(REMOVE_USER_FRENCH_LEVEL, shouldFetchContents);

export const setCurrentLanguageActionCreator = (value: Languages | null) => action(SET_CURRENT_LANGUAGE, value);

export const getUserInfosActionCreator = () => action(GET_USER_INFOS);

export const setUserFavoritesActionCreator = (contentIds: string[]) => action(SET_USER_FAVORITES, contentIds);

export const addUserFavoriteActionCreator = (contentId: string) => action(ADD_USER_FAVORITE, contentId);

export const removeUserFavoriteActionCreator = (contentId: string) => action(REMOVE_USER_FAVORITE, contentId);

export const removeUserAllFavoritesActionCreator = () => action(REMOVE_USER_ALL_FAVORITES);

export const resetUserActionCreator = () => action(RESET_USER);

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
  removeUserAllFavoritesActionCreator,
  setInitialUrlUsed,
  setInitialUrlActionCreator,
  setRedirectDispositifActionCreator,
  resetUserActionCreator,
};
export type UserActions = ActionType<typeof actions>;
