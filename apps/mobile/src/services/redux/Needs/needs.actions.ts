import type { GetNeedResponse } from "@refugies-info/api-types";
import { type ActionType, action } from "typesafe-actions";
import { FETCH_NEEDS, SET_NEEDS } from "./needs.actionTypes";

export const setNeedsActionCreator = (value: GetNeedResponse[]) => action(SET_NEEDS, value);

export const fetchNeedsActionCreator = () => action(FETCH_NEEDS);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = {
  setNeedsActionCreator,
  fetchNeedsActionCreator,
};
export type NeedsActions = ActionType<typeof actions>;
