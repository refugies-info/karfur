import type { GetActiveUsersResponse } from "@refugies-info/api-types";
import { createReducer } from "typesafe-actions";
import type { UsersActions } from "./activeUsers.actions";

export type ActiveUsersState = GetActiveUsersResponse[];

const initialActiveUsersState: ActiveUsersState = [];

export const activeUsersReducer = createReducer<ActiveUsersState, UsersActions>(
  initialActiveUsersState,
  {
    SET_ACTIVE_USERS: (_, action) => action.payload,
  },
);
