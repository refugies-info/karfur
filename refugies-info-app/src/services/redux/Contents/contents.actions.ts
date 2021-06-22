import { SET_CONTENTS, FETCH_CONTENTS } from "./contents.actionTypes";
import { action, ActionType } from "typesafe-actions";
import {
  SimplifiedContent,
  AvailableLanguageI18nCode,
} from "../../../types/interface";

export const setContentsActionCreator = (value: {
  langue: AvailableLanguageI18nCode;
  contents: SimplifiedContent[];
}) => action(SET_CONTENTS, value);

export const fetchContentsActionCreator = (langue: AvailableLanguageI18nCode) =>
  action(FETCH_CONTENTS, langue);

const actions = {
  setContentsActionCreator,
  fetchContentsActionCreator,
};
export type ContentsActions = ActionType<typeof actions>;
