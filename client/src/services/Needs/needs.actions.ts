import { GET_NEEDS, SET_NEEDS, SAVE_NEED } from "./needs.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Need } from "../../types/interface";

export const getNeedsActionCreator = () => action(GET_NEEDS);

export const setNeedsActionCreator = (value: Need[]) =>
  action(SET_NEEDS, value);

export const saveNeedActionCreator = (value: Partial<Need>) =>
  action(SAVE_NEED, value);

const actions = {
  getNeedsActionCreator,
  setNeedsActionCreator,
  saveNeedActionCreator,
};

export type NeedsActions = ActionType<typeof actions>;
