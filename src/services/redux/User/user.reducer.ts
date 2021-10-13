import { createReducer } from "typesafe-actions";
import { UserActions } from "./user.actions";
import { AvailableLanguageI18nCode } from "../../../types/interface";

export interface UserState {
  hasUserSeenOnboarding: boolean;
  hasUserNewFavorites: boolean;
  selectedLanguagei18nCode: AvailableLanguageI18nCode | null;
  currentLanguagei18nCode: AvailableLanguageI18nCode | null;
  city: string | null;
  department: string | null;
  age: string | null;
  frenchLevel: string | null;
  favorites: string[];
}

export const initialUserState = {
  hasUserSeenOnboarding: false,
  hasUserNewFavorites: false,
  selectedLanguagei18nCode: null,
  currentLanguagei18nCode: null,
  city: null,
  department: null,
  age: null,
  frenchLevel: null,
  favorites: []
};

export const userReducer = createReducer<UserState, UserActions>(
  initialUserState,
  {
    SET_USER_HAS_SEEN_ONBOARDING: (state, action) => ({
      ...state,
      hasUserSeenOnboarding: action.payload,
    }),
    SET_USER_HAS_NEW_FAVORITES: (state, action) => ({
      ...state,
      hasUserNewFavorites: action.payload,
    }),
    SET_SELECTED_LANGUAGE: (state, action) => ({
      ...state,
      selectedLanguagei18nCode: action.payload,
    }),
    SET_CURRENT_LANGUAGE: (state, action) => ({
      ...state,
      currentLanguagei18nCode: action.payload,
    }),
    SET_USER_LOCATION: (state, action) => ({
      ...state,
      city: action.payload.city,
      department: action.payload.dep,
    }),
    SET_USER_AGE: (state, action) => ({
      ...state,
      age: action.payload,
    }),
    SET_USER_FRENCH_LEVEL: (state, action) => ({
      ...state,
      frenchLevel: action.payload,
    }),
    SET_USER_FAVORITES: (state, action) => ({
      ...state,
      favorites: action.payload,
    }),
  }
);
