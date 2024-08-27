import { ContentForApp, GetNbContentsForCountyResponse, Languages } from "@refugies-info/api-types";
import { action, ActionType } from "typesafe-actions";
import { FETCH_CONTENTS, SET_CONTENTS, SET_NB_CONTENTS } from "./contents.actionTypes";

export const setContentsActionCreator = (value: { langue: Languages; contents: ContentForApp[] }) =>
  action(SET_CONTENTS, value);

export const setNbContentsActionCreator = (value: GetNbContentsForCountyResponse) => action(SET_NB_CONTENTS, value);

export const fetchContentsActionCreator = () => action(FETCH_CONTENTS);

const actions = {
  setContentsActionCreator,
  setNbContentsActionCreator,
  fetchContentsActionCreator,
};
export type ContentsActions = ActionType<typeof actions>;
