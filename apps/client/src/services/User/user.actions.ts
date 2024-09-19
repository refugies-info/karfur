import { GetUserInfoResponse, Id, UpdateUserRequest } from "@refugies-info/api-types";
import { ActionType, action } from "typesafe-actions";
import { FETCH_USER, SAVE_USER, SET_USER } from "./user.actionTypes";

export const setUserActionCreator = (value: GetUserInfoResponse | null) => action(SET_USER, value);

/**
 * @deprecated use API.updateUser instead to simplify maintanability
 */
export const saveUserActionCreator = (id: Id, value: UpdateUserRequest) => action(SAVE_USER, { id, value });

export const fetchUserActionCreator = (value?: { token?: string }) => action(FETCH_USER, value);

const actions = {
  setUserActionCreator,
  fetchUserActionCreator,
};

export type UserActions = ActionType<typeof actions>;
