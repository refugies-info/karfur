import { SET_CONTENTS, SET_NB_CONTENTS, FETCH_CONTENTS } from "./contents.actionTypes";
import { action, ActionType } from "typesafe-actions";
import {
  SimplifiedContent,
  AvailableLanguageI18nCode,
} from "../../../types/interface";

export const setContentsActionCreator = (value: {
  langue: AvailableLanguageI18nCode;
  contents: SimplifiedContent[];
}) => action(SET_CONTENTS, value);

export const setNbContentsActionCreator = (value: {
  nbLocalizedContent: number | null,
  nbGlobalContent: number | null
}) => action(SET_NB_CONTENTS, value);

export const fetchContentsActionCreator = () => action(FETCH_CONTENTS);

const actions = {
  setContentsActionCreator,
  setNbContentsActionCreator,
  fetchContentsActionCreator,
};
export type ContentsActions = ActionType<typeof actions>;
