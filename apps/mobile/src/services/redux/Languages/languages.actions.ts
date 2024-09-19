import { GetLanguagesResponse } from "@refugies-info/api-types";
import { action, ActionType } from "typesafe-actions";
import { FETCH_LANGUAGES, SET_LANGUAGES } from "./languages.actionTypes";

export const setLanguagesActionCreator = (value: GetLanguagesResponse[]) => action(SET_LANGUAGES, value);

export const fetchLanguagesActionCreator = () => action(FETCH_LANGUAGES);

const actions = {
  setLanguagesActionCreator,
  fetchLanguagesActionCreator,
};
export type LanguagesActions = ActionType<typeof actions>;
