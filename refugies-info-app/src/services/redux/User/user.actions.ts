import { action, ActionType } from "typesafe-actions";
import {
  SET_SELECTED_LANGUAGE,
  SAVE_SELECTED_LANGUAGE,
  SET_CURRENT_LANGUAGE,
  SAVE_USER_CITY,
  SET_USER_CITY,
  SAVE_USER_AGE,
  SAVE_USER_FRENCH_LEVEL,
  SET_USER_AGE,
  SET_USER_FRENCH_LEVEL,
  SET_USER_HAS_SEEN_ONBOARDING,
  SAVE_USER_HAS_SEEN_ONBOARDING,
} from "./user.actionTypes";

export const setHasUserSeenOnboardingActionCreator = () =>
  action(SET_USER_HAS_SEEN_ONBOARDING);

export const saveHasUserSeenOnboardingActionCreator = () =>
  action(SAVE_USER_HAS_SEEN_ONBOARDING);

export const setSelectedLanguageActionCreator = (value: string) =>
  action(SET_SELECTED_LANGUAGE, value);

export const saveSelectedLanguageActionCreator = (value: string) =>
  action(SAVE_SELECTED_LANGUAGE, value);

export const saveUserCityActionCreator = (value: string) =>
  action(SAVE_USER_CITY, value);

export const setUserCityActionCreator = (value: string | null) =>
  action(SET_USER_CITY, value);

export const saveUserAgeActionCreator = (value: string) =>
  action(SAVE_USER_AGE, value);

export const setUserAgeActionCreator = (value: string | null) =>
  action(SET_USER_AGE, value);

export const saveUserFrenchLeveleActionCreator = (value: string) =>
  action(SAVE_USER_FRENCH_LEVEL, value);

export const setUserFrenchLeveleActionCreator = (value: string | null) =>
  action(SET_USER_FRENCH_LEVEL, value);

export const setCurrentLanguageActionCreator = (value: string) =>
  action(SET_CURRENT_LANGUAGE, value);

const actions = {
  setHasUserSeenOnboardingActionCreator,
  setSelectedLanguageActionCreator,
  saveSelectedLanguageActionCreator,
  saveHasUserSeenOnboardingActionCreator,
  setCurrentLanguageActionCreator,
  setUserAgeActionCreator,
  setUserCityActionCreator,
  setUserFrenchLeveleActionCreator,
  saveUserAgeActionCreator,
  saveUserCityActionCreator,
  saveUserFrenchLeveleActionCreator,
};
export type UserActions = ActionType<typeof actions>;
