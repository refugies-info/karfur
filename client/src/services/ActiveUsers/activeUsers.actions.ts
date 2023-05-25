import {
  SET_ACTIVE_USERS,
  FETCH_ACTIVE_USERS,
} from "./activeUsers.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { GetActiveUsersResponse } from "@refugies-info/api-types";

export const setActiveUsersActionCreator = (value: GetActiveUsersResponse[]) =>
  action(SET_ACTIVE_USERS, value);

export const fetchActiveUsersActionCreator = () =>
  action(FETCH_ACTIVE_USERS);

const actions = {
  setActiveUsersActionCreator,
  fetchActiveUsersActionCreator,
};

export type UsersActions = ActionType<typeof actions>;
