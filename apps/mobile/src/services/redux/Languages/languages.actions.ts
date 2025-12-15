import type { GetLanguagesResponse } from "@refugies-info/api-types";
import { type ActionType, action } from "typesafe-actions";
import { FETCH_LANGUAGES, SET_LANGUAGES } from "./languages.actionTypes";

export const setLanguagesActionCreator = (value: GetLanguagesResponse[]) =>
  action(SET_LANGUAGES, value);

export const fetchLanguagesActionCreator = () => action(FETCH_LANGUAGES);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = {
  setLanguagesActionCreator,
  fetchLanguagesActionCreator,
};

export type LanguagesActions = ActionType<typeof actions>;
