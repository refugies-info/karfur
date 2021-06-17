import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, {
  saveSelectedLanguage,
  saveHasUserSeenOnboarding,
  saveUserAge,
  saveUserLocation,
  saveUserFrenchLevel,
} from "../user.saga";
import { saveItemInAsyncStorage } from "../functions";
import {
  setSelectedLanguageActionCreator,
  setHasUserSeenOnboardingActionCreator,
  setCurrentLanguageActionCreator,
} from "../user.actions";

describe("[Saga] user", () => {
  describe("pilot", () => {
    it("should trigger all the sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("SAVE_SELECTED_LANGUAGE", saveSelectedLanguage)
        .next()
        .takeLatest("SAVE_USER_HAS_SEEN_ONBOARDING", saveHasUserSeenOnboarding)
        .next()
        .takeLatest("SAVE_USER_LOCATION", saveUserLocation)
        .next()
        .takeLatest("SAVE_USER_FRENCH_LEVEL", saveUserFrenchLevel)
        .next()
        .takeLatest("SAVE_USER_AGE", saveUserAge)
        .next()
        .isDone();
    });
  });

  describe("save selected language saga", () => {
    it("should call functions and set data", () => {
      testSaga(saveSelectedLanguage, {
        type: "SAVE_SELECTED_LANGUAGE",
        payload: "en",
      })
        .next()
        .call(saveItemInAsyncStorage, "SELECTED_LANGUAGE", "en")
        .next()
        .put(setSelectedLanguageActionCreator("en"))
        .next()
        .put(setCurrentLanguageActionCreator("en"))
        .next()
        .isDone();
    });

    it("should call functions and set fr if saveItemInAsyncStorage throws", () => {
      testSaga(saveSelectedLanguage, {
        type: "SAVE_SELECTED_LANGUAGE",
        payload: "en",
      })
        .next()
        .call(saveItemInAsyncStorage, "SELECTED_LANGUAGE", "en")
        .throw(new Error("error"))
        .put(setSelectedLanguageActionCreator("fr"))
        .next()
        .put(setCurrentLanguageActionCreator("fr"))
        .next()
        .isDone();
    });
  });

  describe("save user has seen onboarding saga", () => {
    it("should call functions and set data", () => {
      testSaga(saveHasUserSeenOnboarding)
        .next()
        .call(saveItemInAsyncStorage, "HAS_USER_SEEN_ONBOARDING", "TRUE")
        .next()
        .put(setHasUserSeenOnboardingActionCreator())
        .next()
        .isDone();
    });

    it("should call functions and set fr if saveItemInAsyncStorage throws", () => {
      testSaga(saveHasUserSeenOnboarding)
        .next()
        .call(saveItemInAsyncStorage, "HAS_USER_SEEN_ONBOARDING", "TRUE")
        .throw(new Error("error"))
        .put(setHasUserSeenOnboardingActionCreator())
        .next()
        .isDone();
    });
  });
});
