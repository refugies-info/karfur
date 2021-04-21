import {
  SET_USER_STRUCTURE,
  FETCH_USER_STRUCTURE,
  UPDATE_USER_STRUCTURE,
} from "./userStructure.actionTypes";
import { UserStructure } from "../../types/interface";
import { action, ActionType } from "typesafe-actions";
import { ObjectId } from "mongodb";

export const setUserStructureActionCreator = (value: UserStructure | null) =>
  action(SET_USER_STRUCTURE, value);

export const fetchUserStructureActionCreator = (value: {
  structureId: ObjectId | null;
  shouldRedirect: boolean;
}) => action(FETCH_USER_STRUCTURE, value);

export const updateUserStructureActionCreator = (value: {
  modifyMembres: boolean;
  data?: {
    type: "modify" | "delete" | "create";
    userId: ObjectId;
    structureId: ObjectId;
    newRole?: "contributeur" | "administrateur";
  };
}) => action(UPDATE_USER_STRUCTURE, value);

const actions = {
  setUserStructureActionCreator,
  fetchUserStructureActionCreator,
  updateUserStructureActionCreator,
};

export type UserStructureActions = ActionType<typeof actions>;
