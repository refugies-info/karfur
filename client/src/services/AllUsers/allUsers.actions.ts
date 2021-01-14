import { SET_ALL_USERS, FETCH_ALL_USERS } from "./allUsers.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { SimplifiedUser } from "../../types/interface";

export const setAllUsersActionsCreator = (value: SimplifiedUser[]) =>
  action(SET_ALL_USERS, value);

export const fetchAllUsersActionsCreator = () => action(FETCH_ALL_USERS);

const actions = {
  setAllUsersActionsCreator,
  fetchAllUsersActionsCreator,
};

export type AllUsersActions = ActionType<typeof actions>;
