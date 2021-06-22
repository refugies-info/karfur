import { userReducer, initialUserState } from "../user.reducer";
import {
  setHasUserSeenOnboardingActionCreator,
  setSelectedLanguageActionCreator,
  setCurrentLanguageActionCreator,
  setUserLocationActionCreator,
  setUserAgeActionCreator,
  setUserFrenchLevelActionCreator,
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

  it("set user current language", () => {
    const state = initialUserState;
    expect(userReducer(state, setCurrentLanguageActionCreator("ar"))).toEqual({
      ...initialUserState,
      currentLanguagei18nCode: "ar",
    });
  });

  it("set user location", () => {
    const state = initialUserState;
    expect(
      userReducer(
        state,
        setUserLocationActionCreator({ city: "city", dep: "dep" })
      )
    ).toEqual({
      ...initialUserState,
      city: "city",
      department: "dep",
    });
  });

  it("set user cage", () => {
    const state = initialUserState;
    expect(userReducer(state, setUserAgeActionCreator("age"))).toEqual({
      ...initialUserState,
      age: "age",
    });
  });

  it("set user french level", () => {
    const state = initialUserState;
    expect(
      userReducer(state, setUserFrenchLevelActionCreator("level"))
    ).toEqual({
      ...initialUserState,
      frenchLevel: "level",
    });
  });
});
