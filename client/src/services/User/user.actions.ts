import { SET_USER, UPDATE_USER, FETCH_USER } from "./user.actionTypes";
import { User } from "../../@types/interface";
import { ActionType, action } from "typesafe-actions";

export const setUserActionCreator = (value: User | null) =>
  action(SET_USER, value);

export const updateUserActionCreator = (value: User) =>
  action(UPDATE_USER, value);

export const fetchUserActionCreator = (value?: {
  shouldRedirect: boolean;
  shouldSetUser: boolean;
  user: User;
}) => action(FETCH_USER, value);

const actions = {
  setUserActionCreator,
  updateUserActionCreator,
  fetchUserActionCreator,
};

export type UserActions = ActionType<typeof actions>;
