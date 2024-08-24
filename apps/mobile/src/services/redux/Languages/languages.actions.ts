import { GetLanguagesResponse } from "@refugies-info/api-types";
import { SET_LANGUAGES, FETCH_LANGUAGES } from "./languages.actionTypes";
import { action, ActionType } from "typesafe-actions";

export const setLanguagesActionCreator = (value: GetLanguagesResponse[]) =>
  action(SET_LANGUAGES, value);

export const fetchLanguagesActionCreator = () => action(FETCH_LANGUAGES);

const actions = {
  setLanguagesActionCreator,
  fetchLanguagesActionCreator,
};
export type LanguagesActions = ActionType<typeof actions>;
