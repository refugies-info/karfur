import {
  SET_LANGUAGES,
  FETCH_LANGUAGES,
  SET_SELECTED_LANGUAGE,
  SAVE_SELECTED_LANGUAGE,
} from "./languages.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Language } from "../../../types/interface";

export const setLanguagesActionCreator = (value: Language[]) =>
  action(SET_LANGUAGES, value);

export const fetchLanguagesActionCreator = () => action(FETCH_LANGUAGES);

export const setSelectedLanguageActionCreator = (value: string) =>
  action(SET_SELECTED_LANGUAGE, value);

export const saveSelectedLanguageActionCreator = (value: string) =>
  action(SAVE_SELECTED_LANGUAGE, value);

const actions = {
  setLanguagesActionCreator,
  fetchLanguagesActionCreator,
  setSelectedLanguageActionCreator,
  saveSelectedLanguageActionCreator,
};
export type LanguagesActions = ActionType<typeof actions>;
