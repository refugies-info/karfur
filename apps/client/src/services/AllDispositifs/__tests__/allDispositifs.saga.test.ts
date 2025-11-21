// @ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import API from "../../../utils/API";
import { LoadingStatusKey, finishLoading, startLoading } from "../../LoadingStatus/loadingStatus.actions";
import { setAllDispositifsActionsCreator } from "../allDispositifs.actions";
import latestActionsSaga, { fetchAllDispositifs } from "../allDispositifs.saga";

describe("[Saga] All dispositifs", () => {
  describe("pilot", () => {
    it("should trigger all the all dispositifs sagas", () => {
      testSaga(latestActionsSaga).next().takeLatest("FETCH_ALL_DISPOSITIFS", fetchAllDispositifs).next().isDone();
    });
  });

  describe("fetch all dispositifs saga", () => {
    it("should call api", () => {
      testSaga(fetchAllDispositifs)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS))
        .next()
        .call(API.getAllDispositifs)
        .next([{ id: "id", origin: "RI" }])
        .put(setAllDispositifsActionsCreator([{ id: "id", origin: "RI" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS))
        .next()
        .isDone();
    });

    it("should filter out RCO dispositifs", () => {
      const mockData = [
        { id: "id1", origin: "RI" },
        { id: "id2", origin: "RCO" },
      ];
      testSaga(fetchAllDispositifs)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS))
        .next()
        .call(API.getAllDispositifs)
        .next(mockData)
        .put(setAllDispositifsActionsCreator([{ id: "id1", origin: "RI" }]))
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
