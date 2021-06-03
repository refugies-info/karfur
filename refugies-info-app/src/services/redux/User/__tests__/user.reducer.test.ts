import { userReducer, initialUserState } from "../user.reducer";
import {
  setHasUserSeenOnboardingActionCreator,
  setSelectedLanguageActionCreator,
} from "../user.actions";

describe("[Reducer] user", () => {
  it("set user has seen onboarding ", () => {
    const state = initialUserState;
    expect(
      userReducer(state, setHasUserSeenOnboardingActionCreator())
    ).toEqual({ ...initialUserState, hasUserSeenOnboarding: true });
  });

  it("set user selected language", () => {
    const state = initialUserState;
    expect(userReducer(state, setSelectedLanguageActionCreator("ar"))).toEqual({
      ...initialUserState,
      selectedLanguagei18nCode: "ar",
    });
  });
});
