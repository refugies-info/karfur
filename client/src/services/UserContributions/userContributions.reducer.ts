import { createReducer } from "typesafe-actions";
import { UserContributionsActions } from "./userContributions.actions";
import { GetUserContributionsResponse } from "api-types";

export type UserContributionsState = GetUserContributionsResponse[];

const initialUserContriubtionsState: UserContributionsState = [];

export const userContributionsReducer = createReducer<
  UserContributionsState,
  UserContributionsActions
>(initialUserContriubtionsState, {
  SET_USER_CONTRIBUTIONS: (_, action) => action.payload,
});
