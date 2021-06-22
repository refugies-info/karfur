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
} from "./user.actionTypes";
import { AvailableLanguageI18nCode } from "../../../types/interface";

export const setHasUserSeenOnboardingActionCreator = () =>
  action(SET_USER_HAS_SEEN_ONBOARDING);

export const saveHasUserSeenOnboardingActionCreator = () =>
  action(SAVE_USER_HAS_SEEN_ONBOARDING);

export const setSelectedLanguageActionCreator = (
  value: AvailableLanguageI18nCode
) => action(SET_SELECTED_LANGUAGE, value);

export const saveSelectedLanguageActionCreator = (
  value: AvailableLanguageI18nCode
) => action(SAVE_SELECTED_LANGUAGE, value);

export const saveUserLocationActionCreator = (value: {
  city: string;
  dep: string;
}) => action(SAVE_USER_LOCATION, value);

export const setUserLocationActionCreator = (value: {
  city: string | null;
  dep: string | null;
}) => action(SET_USER_LOCATION, value);

export const saveUserAgeActionCreator = (value: string) =>
  action(SAVE_USER_AGE, value);

export const setUserAgeActionCreator = (value: string | null) =>
  action(SET_USER_AGE, value);

export const saveUserFrenchLevelActionCreator = (value: string) =>
  action(SAVE_USER_FRENCH_LEVEL, value);

export const setUserFrenchLevelActionCreator = (value: string | null) =>
  action(SET_USER_FRENCH_LEVEL, value);

export const setCurrentLanguageActionCreator = (
  value: AvailableLanguageI18nCode
) => action(SET_CURRENT_LANGUAGE, value);

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
};
export type UserActions = ActionType<typeof actions>;
