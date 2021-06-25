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
  GET_USER_INFOS,
  REMOVE_USER_HAS_SEEN_ONBOARDING,
  REMOVE_SELECTED_LANGUAGE,
  REMOVE_USER_AGE,
  REMOVE_USER_LOCATION,
  REMOVE_USER_FRENCH_LEVEL,
} from "./user.actionTypes";
import { AvailableLanguageI18nCode } from "../../../types/interface";

export const setHasUserSeenOnboardingActionCreator = (value: boolean) =>
  action(SET_USER_HAS_SEEN_ONBOARDING, value);

export const saveHasUserSeenOnboardingActionCreator = () =>
  action(SAVE_USER_HAS_SEEN_ONBOARDING);

export const removeHasUserSeenOnboardingActionCreator = () =>
  action(REMOVE_USER_HAS_SEEN_ONBOARDING);

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
}) => action(SAVE_USER_LOCATION, value);

export const setUserLocationActionCreator = (value: {
  city: string | null;
  dep: string | null;
}) => action(SET_USER_LOCATION, value);

export const removeUserLocationActionCreator = () =>
  action(REMOVE_USER_LOCATION);

export const saveUserAgeActionCreator = (value: string) =>
  action(SAVE_USER_AGE, value);

export const setUserAgeActionCreator = (value: string | null) =>
  action(SET_USER_AGE, value);

export const removeUSerAgeActionCreator = () => action(REMOVE_USER_AGE);

export const saveUserFrenchLevelActionCreator = (value: string) =>
  action(SAVE_USER_FRENCH_LEVEL, value);

export const setUserFrenchLevelActionCreator = (value: string | null) =>
  action(SET_USER_FRENCH_LEVEL, value);

export const removeUserFrenchLevelActionCreator = () =>
  action(REMOVE_USER_FRENCH_LEVEL);

export const setCurrentLanguageActionCreator = (
  value: AvailableLanguageI18nCode | null
) => action(SET_CURRENT_LANGUAGE, value);

export const getUserInfosActionCreator = () => action(GET_USER_INFOS);

const actions = {
  setHasUserSeenOnboardingActionCreator,
  setSelectedLanguageActionCreator,
  saveSelectedLanguageActionCreator,
  saveHasUserSeenOnboardingActionCreator,
  setCurrentLanguageActionCreator,
  setUserAgeActionCreator,
  setUserLocationActionCreator,
  setUserFrenchLevelActionCreator,
  saveUserAgeActionCreator,
  saveUserLocationActionCreator,
  saveUserFrenchLevelActionCreator,
  getUserInfosActionCreator,
  removeHasUserSeenOnboardingActionCreator,
  removeSelectedLanguageActionCreator,
  removeUSerAgeActionCreator,
  removeUserFrenchLevelActionCreator,
  removeUserLocationActionCreator,
};
export type UserActions = ActionType<typeof actions>;
