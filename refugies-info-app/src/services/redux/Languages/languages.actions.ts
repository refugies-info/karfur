import { SET_LANGUAGES, FETCH_LANGUAGES } from "./languages.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Language } from "../../../types/interface";

export const setLanguagesActionCreator = (value: Language[]) =>
  action(SET_LANGUAGES, value);

export const fetchLanguagesActionCreator = () => action(FETCH_LANGUAGES);

const actions = {
  setLanguagesActionCreator,
  fetchLanguagesActionCreator,
};
export type LanguagesActions = ActionType<typeof actions>;
