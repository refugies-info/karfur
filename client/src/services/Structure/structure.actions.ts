import {
  SET_STRUCTURES,
  FETCH_STRUCTURES,
  SET_USER_STRUCTURE,
  FETCH_USER_STRUCTURE,
  UPDATE_USER_STRUCTURE,
} from "./structure.actionTypes";
import { Structure } from "../../@types/interface";
import { action, ActionType } from "typesafe-actions";
import { ObjectId } from "mongodb";

export const setStructuresActionCreator = (value: Structure[]) =>
  action(SET_STRUCTURES, value);

export const fetchStructuresActionCreator = () => action(FETCH_STRUCTURES);

export const setUserStructureActionCreator = (value: Structure) =>
  action(SET_USER_STRUCTURE, value);

export const fetchUserStructureActionCreator = (value: {
  structureId: ObjectId | null;
  shouldRedirect: boolean;
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
