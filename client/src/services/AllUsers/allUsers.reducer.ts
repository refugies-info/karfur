import { SimplifiedUser } from "../../types/interface";
import { createReducer } from "typesafe-actions";
import { AllUsersActions } from "./allUsers.actions";

export type AllUsersState = SimplifiedUser[];

export const initialAllUsersState: AllUsersState = [];

export const allUsersReducer = createReducer<AllUsersState, AllUsersActions>(
  initialAllUsersState,
  {
    SET_ALL_USERS: (_, action) => action.payload,
  }
);
