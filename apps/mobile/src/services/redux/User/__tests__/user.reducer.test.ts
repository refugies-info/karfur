import { MobileFrenchLevel } from "@refugies-info/api-types";
import {
  setCurrentLanguageActionCreator,
  setHasUserSeenOnboardingActionCreator,
  setSelectedLanguageActionCreator,
  setUserAgeActionCreator,
  setUserFrenchLevelActionCreator,
  setUserLocationActionCreator,
} from "../user.actions";
import { initialUserState, userReducer } from "../user.reducer";

describe("[Reducer] user", () => {
  it("set user has seen onboarding ", () => {
    const state = initialUserState;
    expect(userReducer(state, setHasUserSeenOnboardingActionCreator(true))).toEqual({
      ...initialUserState,
      hasUserSeenOnboarding: true,
    });
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
    expect(userReducer(state, setUserLocationActionCreator({ city: "city", dep: "dep" }))).toEqual({
      ...initialUserState,
      city: "city",
      department: "dep",
    });
  });

  it("set user cage", () => {
    const state = initialUserState;
    expect(userReducer(state, setUserAgeActionCreator("0 à 17 ans"))).toEqual({
      ...initialUserState,
      age: "0 à 17 ans",
    });
  });

  it("set user french level", () => {
    const state = initialUserState;
    expect(userReducer(state, setUserFrenchLevelActionCreator(MobileFrenchLevel["Je parle bien"]))).toEqual({
      ...initialUserState,
      frenchLevel: MobileFrenchLevel["Je parle bien"],
    });
  });
});
