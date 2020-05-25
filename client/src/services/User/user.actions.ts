import { SET_USER, UPDATE_USER, FETCH_USER } from "./user.actionTypes";
import API from "../../utils/API";
import { RequestReturn, User } from "../../@types/interface";
import { ActionType, action } from "typesafe-actions";

export const setUserActionCreator = (value: User | null) =>
  action(SET_USER, value);

export const updateUserActionCreator = (value: User) =>
  action(UPDATE_USER, value);

export const fetchUserActionCreator = () => action(FETCH_USER);

const actions = {
  setUserActionCreator,
  updateUserActionCreator,
  fetchUserActionCreator,
};

export type UserActions = ActionType<typeof actions>;
