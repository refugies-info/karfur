// @ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, { fetchAllStructures } from "../allStructures.saga";
import API from "../../../utils/API";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { setAllStructuresActionCreator } from "../allStructures.actions";

describe("[Saga] All structures", () => {
  describe("pilot", () => {
    it("should trigger all the all structures sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_ALL_STRUCTURES", fetchAllStructures)
        .next()
        .isDone();
    });
  });

  describe("fetch all structures saga", () => {
    it("should call api", () => {
      testSaga(fetchAllStructures)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_ALL_STRUCTURES))
        .next()
        .call(API.getAllStructures)
        .next([{ id: "id" }])
        .put(setAllStructuresActionCreator([{ id: "id" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_ALL_STRUCTURES))
        .next()
        .isDone();
    });

    it("should call api put [] when getAllStructures throw", () => {
      testSaga(fetchAllStructures)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_ALL_STRUCTURES))
        .next()
        .call(API.getAllStructures)
        .throw(new Error("error"))
        .put(setAllStructuresActionCreator([]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_ALL_STRUCTURES))
        .next()
        .isDone();
    });
  });
});
