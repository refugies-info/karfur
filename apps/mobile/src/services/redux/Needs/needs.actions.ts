import { GetNeedResponse } from "@refugies-info/api-types";
import { action, ActionType } from "typesafe-actions";
import { FETCH_NEEDS, SET_NEEDS } from "./needs.actionTypes";

export const setNeedsActionCreator = (value: GetNeedResponse[]) => action(SET_NEEDS, value);

export const fetchNeedsActionCreator = () => action(FETCH_NEEDS);

const actions = {
  setNeedsActionCreator,
  fetchNeedsActionCreator,
};
export type NeedsActions = ActionType<typeof actions>;
