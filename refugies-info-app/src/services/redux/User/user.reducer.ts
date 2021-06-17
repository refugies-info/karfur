import { createReducer } from "typesafe-actions";
import { UserActions } from "./user.actions";

export interface UserState {
  hasUserSeenOnboarding: boolean;
  selectedLanguagei18nCode: string | null;
  currentLanguagei18nCode: string | null;
  city: string | null;
  department: string | null;
  age: string | null;
  frenchLevel: string | null;
}

export const initialUserState = {
  hasUserSeenOnboarding: false,
  selectedLanguagei18nCode: null,
  currentLanguagei18nCode: null,
  city: null,
  department: null,
  age: null,
  frenchLevel: null,
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
    SET_CURRENT_LANGUAGE: (state, action) => ({
      ...state,
      currentLanguagei18nCode: action.payload,
    }),
  }
);
