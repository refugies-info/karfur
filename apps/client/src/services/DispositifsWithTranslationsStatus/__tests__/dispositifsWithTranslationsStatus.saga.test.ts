//@ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, {
  fetchDispositifTranslationsStatus,
} from "../dispositifsWithTranslationsStatus.saga";
import { FETCH_DISPOSITIFS_TRANSLATIONS_STATUS } from "../dispositifsWithTranslationsStatus.actionTypes";
import API from "../../../utils/API";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { setDispositifsWithTranslationsStatusActionCreator } from "../dispositifsWithTranslationsStatus.actions";

describe("[Saga] dispositifsWithTranslationsStatus", () => {
  describe("pilot", () => {
    it("should trigger all the sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest(
          "FETCH_DISPOSITIFS_TRANSLATIONS_STATUS",
          fetchDispositifTranslationsStatus
        )
        .next()
        .isDone();
    });
  });

  describe("fetch dispos with translations saga", () => {
    it("should call function sand set data", () => {
      testSaga(fetchDispositifTranslationsStatus, {
        type: FETCH_DISPOSITIFS_TRANSLATIONS_STATUS,
        payload: "ps",
      })
        .next()
        .put(
          startLoading(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS)
        )
        .next()
        .call(API.getDispositifsWithTranslationAvancement, "ps")
        .next([{ _id: "id" }])
        .put(setDispositifsWithTranslationsStatusActionCreator([{ _id: "id" }]))
        .next()
        .put(
          finishLoading(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS)
        )
        .next()
        .isDone();
    });

    it("should call call get dispo and set [] if throws", () => {
      testSaga(fetchDispositifTranslationsStatus, {
        type: FETCH_DISPOSITIFS_TRANSLATIONS_STATUS,
        payload: "en",
      })
        .next()
        .put(
          startLoading(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS)
        )
        .next()
        .call(API.getDispositifsWithTranslationAvancement, "en")
        .throw(new Error("test"))
        .put(setDispositifsWithTranslationsStatusActionCreator([]))
        .next()
        .put(
          finishLoading(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS)
        )
        .next()
        .isDone();
    });
  });
});
