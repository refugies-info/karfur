import { RootState } from "../rootReducer";
import { UserContributionsState } from "./userContributions.reducer";

export const userContributionsSelector = (
  state: RootState
): UserContributionsState => state.userContributions;
