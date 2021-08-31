import {
  GET_NEEDS,
  SET_NEEDS,
  SAVE_NEED,
  CREATE_NEED,
} from "./needs.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Need } from "../../types/interface";

export const fetchNeedsActionCreator = () => action(GET_NEEDS);

export const setNeedsActionCreator = (value: Need[]) =>
  action(SET_NEEDS, value);

export const saveNeedActionCreator = (value: Partial<Need>) =>
  action(SAVE_NEED, value);

export const createNeedActionCreator = (value: { name: string; tag: string }) =>
  action(CREATE_NEED, value);

const actions = {
  fetchNeedsActionCreator,
  setNeedsActionCreator,
  saveNeedActionCreator,
  createNeedActionCreator,
};

export type NeedsActions = ActionType<typeof actions>;
