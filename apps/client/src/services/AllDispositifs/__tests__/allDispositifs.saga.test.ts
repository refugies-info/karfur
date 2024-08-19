// @ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, { fetchAllDispositifs } from "../allDispositifs.saga";
import API from "../../../utils/API";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { setAllDispositifsActionsCreator } from "../allDispositifs.actions";

describe("[Saga] All dispositifs", () => {
  describe("pilot", () => {
    it("should trigger all the all dispositifs sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_ALL_DISPOSITIFS", fetchAllDispositifs)
        .next()
        .isDone();
    });
  });

  describe("fetch all dispositifs saga", () => {
    it("should call api", () => {
      testSaga(fetchAllDispositifs)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS))
        .next()
        .call(API.getAllDispositifs)
        .next([{ id: "id" }])
        .put(setAllDispositifsActionsCreator([{ id: "id" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS))
        .next()
        .isDone();
    });

    it("should call api put [] when getAllDispositifs throw", () => {
      testSaga(fetchAllDispositifs)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS))
        .next()
        .call(API.getAllDispositifs)
        .throw(new Error("error"))
        .put(setAllDispositifsActionsCreator([]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS))
        .next()
        .isDone();
    });
  });
});
