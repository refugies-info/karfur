import type { GetUserContributionsResponse } from "@refugies-info/api-types";
import { createReducer } from "typesafe-actions";
import type { UserContributionsActions } from "./userContributions.actions";

export type UserContributionsState = GetUserContributionsResponse[];

const initialUserContriubtionsState: UserContributionsState = [];

export const userContributionsReducer = createReducer<
  UserContributionsState,
  UserContributionsActions
>(initialUserContriubtionsState, {
  SET_USER_CONTRIBUTIONS: (_, action) => action.payload,
});
