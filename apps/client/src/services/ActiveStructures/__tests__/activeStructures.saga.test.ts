// @ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, {
  fetchActiveStructures,
} from "../activeStructures.saga";
import API from "../../../utils/API";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { setActiveStructuresActionCreator } from "../activeStructures.actions";

describe("[Saga] Structures", () => {
  describe("pilot", () => {
    it("should trigger all the structures sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_ACTIVE_STRUCTURES", fetchActiveStructures)
        .next()
        .isDone();
    });
  });

  describe("fetch structures saga", () => {
    it("should call api", () => {
      testSaga(fetchActiveStructures)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_STRUCTURES))
        .next()
        .call(API.getActiveStructures)
        .next([{ id: "id" }])
        .put(setActiveStructuresActionCreator([{ id: "id" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_STRUCTURES))
        .next()
        .isDone();
    });

    it("should call api put [] when getActiveStructures throw", () => {
      testSaga(fetchActiveStructures)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_STRUCTURES))
        .next()
        .call(API.getActiveStructures)
        .throw(new Error("error"))
        .put(setActiveStructuresActionCreator([]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_STRUCTURES))
        .next()
        .isDone();
    });
  });
});
