import { action, ActionType } from "typesafe-actions";

export const setHasUserSeenOnboardingActionCreator = () =>
  action("SET_USER_HAS_SEEN_ONBOARDING");

const actions = {
  setHasUserSeenOnboardingActionCreator,
};
export type UserActions = ActionType<typeof actions>;
