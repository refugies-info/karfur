import { GetActiveStructuresResponse } from "@refugies-info/api-types";
import { action, ActionType } from "typesafe-actions";
import { FETCH_ACTIVE_STRUCTURES, SET_ACTIVE_STRUCTURES } from "./activeStructures.actionTypes";

export const setActiveStructuresActionCreator = (value: GetActiveStructuresResponse[]) =>
  action(SET_ACTIVE_STRUCTURES, value);

export const fetchActiveStructuresActionCreator = () => action(FETCH_ACTIVE_STRUCTURES);

const actions = {
  setActiveStructuresActionCreator,
  fetchActiveStructuresActionCreator,
};

export type StructuresActions = ActionType<typeof actions>;
