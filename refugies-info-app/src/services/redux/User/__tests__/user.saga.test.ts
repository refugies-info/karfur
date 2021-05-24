import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, { saveSelectedLanguage } from "../user.saga";
import { saveSelectedLanguageInAsyncStorage } from "../functions";
import { setSelectedLanguageActionCreator } from "../user.actions";

describe("[Saga] user", () => {
  describe("pilot", () => {
    it("should trigger all the sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("SAVE_SELECTED_LANGUAGE", saveSelectedLanguage)
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
        .call(saveSelectedLanguageInAsyncStorage, "en")
        .next()
        .put(setSelectedLanguageActionCreator("en"))
        .next()
        .isDone();
    });

    it("should call functions and set fr if saveSelectedLanguageInAsyncStorage throws", () => {
      testSaga(saveSelectedLanguage, {
        type: "SAVE_SELECTED_LANGUAGE",
        payload: "en",
      })
        .next()
        .call(saveSelectedLanguageInAsyncStorage, "en")
        .throw(new Error("error"))
        .put(setSelectedLanguageActionCreator("fr"))
        .next()
        .isDone();
    });
  });
});
