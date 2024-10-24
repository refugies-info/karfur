import { GetActiveUsersResponse } from "@refugies-info/api-types";
import { createReducer } from "typesafe-actions";
import { UsersActions } from "./activeUsers.actions";

export type ActiveUsersState = GetActiveUsersResponse[];

const initialActiveUsersState: ActiveUsersState = [];

export const activeUsersReducer = createReducer<ActiveUsersState, UsersActions>(initialActiveUsersState, {
  SET_ACTIVE_USERS: (_, action) => action.payload,
});
