import { createReducer } from "typesafe-actions";
import { AllUsersActions } from "./allUsers.actions";
import { GetAllUsersResponse } from "@refugies-info/api-types";

export type AllUsersState = GetAllUsersResponse[];

export const initialAllUsersState: AllUsersState = [];

export const allUsersReducer = createReducer<AllUsersState, AllUsersActions>(
  initialAllUsersState,
  {
    SET_ALL_USERS: (_, action) => action.payload,
  }
);
