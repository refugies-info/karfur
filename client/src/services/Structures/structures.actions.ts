import {
  SET_STRUCTURES,
  FETCH_STRUCTURES,
} from "../Structures/structures.actionTypes";
import { Structure } from "../../@types/interface";
import { action, ActionType } from "typesafe-actions";

export const setStructuresActionCreator = (value: Structure[]) =>
  action(SET_STRUCTURES, value);

export const fetchStructuresActionCreator = () => action(FETCH_STRUCTURES);

const actions = {
  setStructuresActionCreator,
  fetchStructuresActionCreator,
};

export type StructureActions = ActionType<typeof actions>;
