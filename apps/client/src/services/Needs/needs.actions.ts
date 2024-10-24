import { GetNeedResponse, Id, NeedRequest, UpdatePositionsRequest } from "@refugies-info/api-types";
import { action, ActionType } from "typesafe-actions";
import { CREATE_NEED, DELETE_NEED, GET_NEEDS, ORDER_NEEDS, SAVE_NEED, SET_NEEDS } from "./needs.actionTypes";

export const fetchNeedsActionCreator = () => action(GET_NEEDS);

export const setNeedsActionCreator = (value: GetNeedResponse[]) => action(SET_NEEDS, value);

export const saveNeedActionCreator = (id: Id, value: Partial<NeedRequest>) => action(SAVE_NEED, { id, value });

export const createNeedActionCreator = (value: NeedRequest) => action(CREATE_NEED, value);

export const deleteNeedActionCreator = (value: Id) => action(DELETE_NEED, value);

export const orderNeedsActionCreator = (value: UpdatePositionsRequest) => action(ORDER_NEEDS, value);

const actions = {
  fetchNeedsActionCreator,
  setNeedsActionCreator,
  saveNeedActionCreator,
  createNeedActionCreator,
  deleteNeedActionCreator,
  orderNeedsActionCreator,
};

export type NeedsActions = ActionType<typeof actions>;
