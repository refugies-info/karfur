import {
  SET_ACTIVE_STRUCTURES,
  FETCH_ACTIVE_STRUCTURES,
} from "./activeStructures.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { GetActiveStructuresResponse } from "api-types";

export const setActiveStructuresActionCreator = (value: GetActiveStructuresResponse[]) =>
  action(SET_ACTIVE_STRUCTURES, value);

export const fetchActiveStructuresActionCreator = () =>
  action(FETCH_ACTIVE_STRUCTURES);

const actions = {
  setActiveStructuresActionCreator,
  fetchActiveStructuresActionCreator,
};

export type StructuresActions = ActionType<typeof actions>;
