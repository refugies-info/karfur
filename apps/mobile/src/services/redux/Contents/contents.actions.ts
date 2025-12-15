import type {
  ContentForApp,
  GetNbContentsForCountyResponse,
  Languages,
} from "@refugies-info/api-types";
import { type ActionType, action } from "typesafe-actions";
import { FETCH_CONTENTS, SET_CONTENTS, SET_NB_CONTENTS } from "./contents.actionTypes";

export const setContentsActionCreator = (value: { langue: Languages; contents: ContentForApp[] }) =>
  action(SET_CONTENTS, value);

export const setNbContentsActionCreator = (value: GetNbContentsForCountyResponse) =>
  action(SET_NB_CONTENTS, value);

export const fetchContentsActionCreator = () => action(FETCH_CONTENTS);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = {
  setContentsActionCreator,
  setNbContentsActionCreator,
  fetchContentsActionCreator,
};

export type ContentsActions = ActionType<typeof actions>;
