import { GetAllStructuresResponse } from "@refugies-info/api-types";
import { ActionType, action } from "typesafe-actions";
import { ADD_TO_ALL_STRUCTURES, FETCH_ALL_STRUCTURES, SET_ALL_STRUCTURES } from "./allStructures.actionTypes";

export const setAllStructuresActionCreator = (value: GetAllStructuresResponse[]) => action(SET_ALL_STRUCTURES, value);

export const addToAllStructuresActionCreator = (value: Partial<GetAllStructuresResponse>) =>
  action(ADD_TO_ALL_STRUCTURES, value);

export const fetchAllStructuresActionsCreator = () => action(FETCH_ALL_STRUCTURES);

const actions = {
  setAllStructuresActionCreator,
  fetchAllStructuresActionsCreator,
  addToAllStructuresActionCreator,
};

export type AllStructuresActions = ActionType<typeof actions>;
