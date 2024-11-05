import { GetAllUsersResponse } from "@refugies-info/api-types";
import { ActionType, action } from "typesafe-actions";
import { FETCH_ALL_USERS, SET_ALL_USERS } from "./allUsers.actionTypes";

export const setAllUsersActionsCreator = (value: GetAllUsersResponse[]) => action(SET_ALL_USERS, value);

export const fetchAllUsersActionsCreator = () => action(FETCH_ALL_USERS);

const actions = {
  setAllUsersActionsCreator,
  fetchAllUsersActionsCreator,
};

export type AllUsersActions = ActionType<typeof actions>;
