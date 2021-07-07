// @ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, {
  fetchSelectedStructure,
} from "../selectedStructure.saga";
import API from "../../../utils/API";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { setSelectedStructureActionCreator } from "../selectedStructure.actions";
import { FETCH_SELECTED_STRUCTURE } from "../selectedStructure.actionTypes";

describe("[Saga] Structures", () => {
  describe("pilot", () => {
    it("should trigger all the structures sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_SELECTED_STRUCTURE", fetchSelectedStructure)
        .next()
        .isDone();
    });
  });

  describe("fetch selected structure saga", () => {
    it("should call api", () => {
      testSaga(fetchSelectedStructure, {
        type: FETCH_SELECTED_STRUCTURE,
        payload: { id: "id", locale: "locale" },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", true, "locale", true)
        .next({ data: { data: { id: "id" } } })
        .put(setSelectedStructureActionCreator({ id: "id" }))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call api put [] when getActiveStructures throw", () => {
      testSaga(fetchSelectedStructure, {
        type: FETCH_SELECTED_STRUCTURE,
        payload: { id: "id", locale: "locale" },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", true, "locale", true)
        .throw(new Error("error"))
        .put(setSelectedStructureActionCreator(null))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE))
        .next()
        .isDone();
    });
  });
});
