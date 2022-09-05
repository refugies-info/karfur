import { ObjectId } from "mongodb";
import {
  GET_NEEDS,
  SET_NEEDS,
  SAVE_NEED,
  CREATE_NEED,
  DELETE_NEED,
  ORDER_NEEDS
} from "./needs.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Need } from "../../types/interface";

export const fetchNeedsActionCreator = () => action(GET_NEEDS);

export const setNeedsActionCreator = (value: Need[]) =>
  action(SET_NEEDS, value);

export const saveNeedActionCreator = (value: Partial<Need>) =>
  action(SAVE_NEED, value);

export const createNeedActionCreator = (value: Partial<Need>) =>
  action(CREATE_NEED, value);

export const deleteNeedActionCreator = (value: ObjectId) =>
  action(DELETE_NEED, value);

export const orderNeedsActionCreator = (value: ObjectId[]) =>
  action(ORDER_NEEDS, value);

const actions = {
  fetchNeedsActionCreator,
  setNeedsActionCreator,
  saveNeedActionCreator,
  createNeedActionCreator,
  deleteNeedActionCreator,
  orderNeedsActionCreator
};

export type NeedsActions = ActionType<typeof actions>;
