import { GetLanguagesResponse } from "@refugies-info/api-types";
import { action, ActionType } from "typesafe-actions";
import { FETCH_LANGUES, SET_LANGUES, TOGGLE_LANG_MODAL, TOGGLE_LANGUE } from "../Langue/langue.actionTypes";

export const setLanguesActionCreator = (value: GetLanguagesResponse[]) => action(SET_LANGUES, value);

export const fetchLanguesActionCreator = () => action(FETCH_LANGUES);

export const toggleLangueModalActionCreator = (payload?: boolean) => action(TOGGLE_LANG_MODAL, payload);

export const toggleLangueActionCreator = (value: string) => action(TOGGLE_LANGUE, value);

const actions = {
  setLanguesActionCreator,
  toggleLangueModalActionCreator,
  toggleLangueActionCreator,
  fetchLanguesActionCreator,
};
export type LangueActions = ActionType<typeof actions>;
