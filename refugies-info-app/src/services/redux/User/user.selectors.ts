import { RootState } from "../reducers";

export const hasUserSeenOnboardingSelector = (state: RootState) =>
  state.user.hasUserSeenOnboarding;

export const selectedI18nCodeSelector = (state: RootState) =>
  state.user.selectedLanguagei18nCode;

export const currentI18nCodeSelector = (state: RootState) =>
  state.user.currentLanguagei18nCode;
