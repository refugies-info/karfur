import {
  SET_ALL_STRUCTURES,
  FETCH_ALL_STRUCTURES,
} from "./allStructures.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { GetAllStructuresResponse } from "api-types";

export const setAllStructuresActionCreator = (
  value: GetAllStructuresResponse[]
) => action(SET_ALL_STRUCTURES, value);

export const fetchAllStructuresActionsCreator = () =>
  action(FETCH_ALL_STRUCTURES);

const actions = {
  setAllStructuresActionCreator,
  fetchAllStructuresActionsCreator,
};

export type AllStructuresActions = ActionType<typeof actions>;
