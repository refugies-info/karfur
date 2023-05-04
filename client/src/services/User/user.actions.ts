import {
  SET_USER,
  UPDATE_USER,
  FETCH_USER,
  SET_USER_ROLE_IN_STRUCTURE,
  SAVE_USER,
} from "./user.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { GetUserInfoResponse, Id, UpdateUserRequest } from "api-types";

export const setUserActionCreator = (value: GetUserInfoResponse | null) =>
  action(SET_USER, value);

export const setUserRoleInStructureActionCreator = (value: string[]) =>
  action(SET_USER_ROLE_IN_STRUCTURE, value);

export const updateUserActionCreator = (value: GetUserInfoResponse) =>
  action(UPDATE_USER, value);

export const saveUserActionCreator = (id: Id, value: UpdateUserRequest) => action(SAVE_USER, { id, value });

export const fetchUserActionCreator = (value?: {
  shouldRedirect?: boolean;
  user?: GetUserInfoResponse;
  token?: string
}) => action(FETCH_USER, value);

const actions = {
  setUserActionCreator,
  updateUserActionCreator,
  fetchUserActionCreator,
  setUserRoleInStructureActionCreator,
};

export type UserActions = ActionType<typeof actions>;
