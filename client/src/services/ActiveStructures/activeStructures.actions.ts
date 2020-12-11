import {
  SET_ACTIVE_STRUCTURES,
  FETCH_ACTIVE_STRUCTURES,
} from "./activeStructures.actionTypes";
import { Structure } from "../../@types/interface";
import { action, ActionType } from "typesafe-actions";

export const setActiveStructuresActionCreator = (value: Structure[]) =>
  action(SET_ACTIVE_STRUCTURES, value);

export const fetchActiveStructuresActionCreator = () =>
  action(FETCH_ACTIVE_STRUCTURES);

const actions = {
  setActiveStructuresActionCreator,
  fetchActiveStructuresActionCreator,
};

export type StructuresActions = ActionType<typeof actions>;
