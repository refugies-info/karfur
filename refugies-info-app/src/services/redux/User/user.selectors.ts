import { RootState } from "../reducers";

export const hasUserSeenOnboardingSelector = (state: RootState) =>
  state.user.hasUserSeenOnboarding;

export const selectedI18nCodeSelector = (state: RootState) =>
  state.user.selectedLanguagei18nCode;
