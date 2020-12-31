import {
  SET_LANGUES,
  TOGGLE_LANG_MODAL,
  TOGGLE_LANGUE,
  FETCH_LANGUES,
} from "../Langue/langue.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Language } from "../../types/interface";

export const setLanguesActionCreator = (value: Language[]) =>
  action(SET_LANGUES, value);

export const fetchLanguesActionCreator = () => action(FETCH_LANGUES);

export const toggleLangueModalActionCreator = () => action(TOGGLE_LANG_MODAL);

export const toggleLangueActionCreator = (value: string) =>
  action(TOGGLE_LANGUE, value);

const actions = {
  setLanguesActionCreator,
  toggleLangueModalActionCreator,
  toggleLangueActionCreator,
  fetchLanguesActionCreator,
};
export type LangueActions = ActionType<typeof actions>;
