import { GetStructureResponse, Id, StructureMemberRole } from "@refugies-info/api-types";
import { action, ActionType } from "typesafe-actions";
import { FETCH_USER_STRUCTURE, SET_USER_STRUCTURE, UPDATE_USER_STRUCTURE } from "./userStructure.actionTypes";

export const setUserStructureActionCreator = (value: GetStructureResponse | null) => action(SET_USER_STRUCTURE, value);

export const fetchUserStructureActionCreator = (value: { structureId: Id | null; shouldRedirect: boolean }) =>
  action(FETCH_USER_STRUCTURE, value);

export const updateUserStructureActionCreator = (value: {
  structure?: {
    hasResponsibleSeenNotification: boolean;
  };
  membres?: {
    type: "modify" | "delete" | "create";
    userId: Id;
    structureId: Id;
    newRole?: StructureMemberRole;
  };
}) => action(UPDATE_USER_STRUCTURE, value);

const actions = {
  setUserStructureActionCreator,
  fetchUserStructureActionCreator,
  updateUserStructureActionCreator,
};

export type UserStructureActions = ActionType<typeof actions>;
