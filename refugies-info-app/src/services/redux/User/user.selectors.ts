import { RootState } from "../reducers";

export const hasUserSeenOnboardingSelector = (state: RootState) =>
  state.user.hasUserSeenOnboarding;
