import { createReducer } from "typesafe-actions";
import { UserActions } from "./user.actions";

export interface UserState {
  hasUserSeenOnboarding: boolean;
}

export const initialUserState = {
  hasUserSeenOnboarding: false,
};

export const userReducer = createReducer<UserState, UserActions>(
  initialUserState,
  {
    SET_USER_HAS_SEEN_ONBOARDING: (state) => ({
      ...state,
      hasUserSeenOnboarding: true,
    }),
  }
);
