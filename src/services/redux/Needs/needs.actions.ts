import { GetNeedResponse } from "@refugies-info/api-types";
import { SET_NEEDS, FETCH_NEEDS } from "./needs.actionTypes";
import { action, ActionType } from "typesafe-actions";

export const setNeedsActionCreator = (value: GetNeedResponse[]) =>
  action(SET_NEEDS, value);

export const fetchNeedsActionCreator = () => action(FETCH_NEEDS);

const actions = {
  setNeedsActionCreator,
  fetchNeedsActionCreator,
};
export type NeedsActions = ActionType<typeof actions>;
