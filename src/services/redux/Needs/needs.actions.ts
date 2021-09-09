import { SET_NEEDS, FETCH_NEEDS } from "./needs.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Need } from "../../../types/interface";

export const setNeedsActionCreator = (value: Need[]) =>
  action(SET_NEEDS, value);

export const fetchNeedsActionCreator = () => action(FETCH_NEEDS);

const actions = {
  setNeedsActionCreator,
  fetchNeedsActionCreator,
};
export type NeedsActions = ActionType<typeof actions>;
