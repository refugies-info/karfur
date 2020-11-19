import {
  SET_STRUCTURES_NEW,
  FETCH_STRUCTURES_NEW,
} from "./structures.actionTypes";
import { Structure } from "../../@types/interface";
import { action, ActionType } from "typesafe-actions";

export const setStructuresNewActionCreator = (value: Structure[]) =>
  action(SET_STRUCTURES_NEW, value);

export const fetchStructuresNewActionCreator = () =>
  action(FETCH_STRUCTURES_NEW);

const actions = {
  setStructuresNewActionCreator,
  fetchStructuresNewActionCreator,
};

export type StructuresActions = ActionType<typeof actions>;
