import {
  SET_STRUCTURES,
  FETCH_STRUCTURES,
  SET_USER_STRUCTURE,
  FETCH_USER_STRUCTURE,
  UPDATE_USER_STRUCTURE,
} from "../Structures/structures.actionTypes";
import { Structure } from "../../@types/interface";
import { action, ActionType } from "typesafe-actions";

export const setStructuresActionCreator = (value: Structure[]) =>
  action(SET_STRUCTURES, value);

export const fetchStructuresActionCreator = () => action(FETCH_STRUCTURES);

export const setUserStructureActionCreator = (value: Structure | null) =>
  action(SET_USER_STRUCTURE, value);

export const fetchUserStructureActionCreator = (value: {
  structureId: string | null;
}) => action(FETCH_USER_STRUCTURE, value);

export const updateUserStructureActionCreator = () =>
  action(UPDATE_USER_STRUCTURE);

const actions = {
  setStructuresActionCreator,
  fetchStructuresActionCreator,
  setUserStructureActionCreator,
  fetchUserStructureActionCreator,
  updateUserStructureActionCreator,
};

export type StructureActions = ActionType<typeof actions>;
