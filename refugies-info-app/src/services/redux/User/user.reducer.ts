import { createReducer } from "typesafe-actions";
import { UserActions } from "./user.actions";

export interface UserState {
  hasUserSeenOnboarding: boolean;
  selectedLanguagei18nCode: string | null;
}

export const initialUserState = {
  hasUserSeenOnboarding: false,
  selectedLanguagei18nCode: null,
};

export const userReducer = createReducer<UserState, UserActions>(
  initialUserState,
  {
    SET_USER_HAS_SEEN_ONBOARDING: (state) => ({
      ...state,
      hasUserSeenOnboarding: true,
    }),
    SET_SELECTED_LANGUAGE: (state, action) => ({
      ...state,
      selectedLanguagei18nCode: action.payload,
    }),
  }
);
