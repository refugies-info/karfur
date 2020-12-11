// @ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, { fetchStructures } from "../activeStructures.saga";
import API from "../../../utils/API";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { setStructuresNewActionCreator } from "../activeStructures.actions";

describe("[Saga] Structures", () => {
  describe("pilot", () => {
    it("should trigger all the structures sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_STRUCTURES_NEW", fetchStructures)
        .next()
        .isDone();
    });
  });

  describe("fetch structures saga", () => {
    it("should call api", () => {
      testSaga(fetchStructures)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_STRUCTURES))
        .next()
        .call(API.getActiveStructures)
        .next({ data: { data: [{ id: "id" }] } })
        .put(setStructuresNewActionCreator([{ id: "id" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_STRUCTURES))
        .next()
        .isDone();
    });

    it("should call api put [] when getActiveStructures throw", () => {
      testSaga(fetchStructures)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_STRUCTURES))
        .next()
        .call(API.getActiveStructures)
        .throw(new Error("error"))
        .put(setStructuresNewActionCreator([]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_STRUCTURES))
        .next()
        .isDone();
    });
  });
});
