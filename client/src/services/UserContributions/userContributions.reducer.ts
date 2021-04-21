import { createReducer } from "typesafe-actions";
import { UserContributionsActions } from "./userContributions.actions";
import { IUserContribution } from "../../types/interface";

export type UserContributionsState = IUserContribution[];

const initialUserContriubtionsState: UserContributionsState = [];

export const userContributionsReducer = createReducer<
  UserContributionsState,
  UserContributionsActions
>(initialUserContriubtionsState, {
  SET_USER_CONTRIBUTIONS: (_, action) => action.payload,
});
