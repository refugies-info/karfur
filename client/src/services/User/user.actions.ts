import {
  SET_USER,
  UPDATE_USER,
  FETCH_USER,
  SET_USER_ROLE_IN_STRUCTURE,
  SAVE_USER,
} from "./user.actionTypes";
import { User } from "../../types/interface";
import { ActionType, action } from "typesafe-actions";

export const setUserActionCreator = (value: User | null) =>
  action(SET_USER, value);

export const setUserRoleInStructureActionCreator = (value: string[]) =>
  action(SET_USER_ROLE_IN_STRUCTURE, value);

export const updateUserActionCreator = (value: User) =>
  action(UPDATE_USER, value);

export const saveUserActionCreator = (value: {
  user: Partial<User>;
  type: "modify-with-roles" | "delete" | "modify-my-details";
}) => action(SAVE_USER, value);

export const fetchUserActionCreator = (value?: {
  shouldRedirect: boolean;
  user: User;
}) => action(FETCH_USER, value);

const actions = {
  setUserActionCreator,
  updateUserActionCreator,
  fetchUserActionCreator,
  setUserRoleInStructureActionCreator,
};

export type UserActions = ActionType<typeof actions>;
