import { GetStructureResponse, Id } from "@refugies-info/api-types";
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
    type: "delete" | "create";
    userId: Id;
    structureId: Id;
  };
}) => action(UPDATE_USER_STRUCTURE, value);

const actions = {
  setUserStructureActionCreator,
  fetchUserStructureActionCreator,
  updateUserStructureActionCreator,
};

export type UserStructureActions = ActionType<typeof actions>;
