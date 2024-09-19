// @ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import API from "../../../utils/API";
import { LoadingStatusKey, finishLoading, startLoading } from "../../LoadingStatus/loadingStatus.actions";
import { fetchSelectedStructureActionCreator, setSelectedStructureActionCreator } from "../selectedStructure.actions";
import { FETCH_SELECTED_STRUCTURE, UPDATE_SELECTED_STRUCTURE } from "../selectedStructure.actionTypes";
import latestActionsSaga, { fetchSelectedStructure, updateSelectedStructure } from "../selectedStructure.saga";
import { selectedStructureSelector } from "../selectedStructure.selector";

describe("[Saga] Structures", () => {
  describe("pilot", () => {
    it("should trigger all the structures sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_SELECTED_STRUCTURE", fetchSelectedStructure)
        .next()
        .takeLatest("UPDATE_SELECTED_STRUCTURE", updateSelectedStructure)
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
        .call(API.getStructureById, "id", "locale", { token: undefined })
        .next({ id: "id" })
        .put(setSelectedStructureActionCreator({ id: "id" }))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call api with user token", () => {
      testSaga(fetchSelectedStructure, {
        type: FETCH_SELECTED_STRUCTURE,
        payload: { id: "id", locale: "locale", token: "userToken" },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", "locale", { token: "userToken" })
        .next({ id: "id" })
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
        .call(API.getStructureById, "id", "locale", { token: undefined })
        .throw(new Error("error"))
        .put(setSelectedStructureActionCreator(null))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE))
        .next()
        .isDone();
    });
  });

  describe("updateSelectedStructure", () => {
    it("should call and dispatch correct actions if no structure", () => {
      testSaga(updateSelectedStructure, {
        type: UPDATE_SELECTED_STRUCTURE,
        payload: { locale: "fr" },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_SELECTED_STRUCTURE))
        .next()
        .select(selectedStructureSelector)
        .next(null)
        .isDone();
    });

    it("should call and dispatch correct actions if structure", () => {
      testSaga(updateSelectedStructure, {
        type: UPDATE_SELECTED_STRUCTURE,
        payload: { locale: "fr" },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_SELECTED_STRUCTURE))
        .next()
        .select(selectedStructureSelector)
        .next({ _id: "structureId", nom: "ma structure" })
        .call(API.updateStructure, "structureId", { nom: "ma structure" })
        .next()
        .put(
          fetchSelectedStructureActionCreator({
            id: "structureId",
            locale: "fr",
          }),
        )
        .next()
        .put(finishLoading(LoadingStatusKey.UPDATE_SELECTED_STRUCTURE))
        .next()
        .isDone();
    });
  });
});
