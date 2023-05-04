import {
  SET_USER_STRUCTURE,
  FETCH_USER_STRUCTURE,
  UPDATE_USER_STRUCTURE,
} from "./userStructure.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { GetStructureResponse, Id } from "api-types";

export const setUserStructureActionCreator = (value: GetStructureResponse | null) =>
  action(SET_USER_STRUCTURE, value);

export const fetchUserStructureActionCreator = (value: {
  structureId: Id | null;
  shouldRedirect: boolean;
}) => action(FETCH_USER_STRUCTURE, value);

export const updateUserStructureActionCreator = (value: {
  structure?: {
    hasResponsibleSeenNotification: boolean
  },
  membres?: {
    type: "modify" | "delete" | "create";
    userId: Id;
    structureId: Id;
    newRole?: "contributeur" | "administrateur";
  };
}) => action(UPDATE_USER_STRUCTURE, value);

const actions = {
  setUserStructureActionCreator,
  fetchUserStructureActionCreator,
  updateUserStructureActionCreator,
};

export type UserStructureActions = ActionType<typeof actions>;
