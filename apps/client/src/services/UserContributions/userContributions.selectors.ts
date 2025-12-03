import type { RootState } from "../rootReducer";
import type { UserContributionsState } from "./userContributions.reducer";

export const userContributionsSelector = (state: RootState): UserContributionsState =>
  state.userContributions;
