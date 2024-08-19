// @ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, {
  fetchWidgets,
  saveWidget,
  createWidget,
  deleteWidget
} from "../widgets.saga";
import {
  DELETE_WIDGET,
  SAVE_WIDGET,
  CREATE_WIDGET,
} from "../widgets.actionTypes";
import API from "../../../utils/API";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { setWidgetsActionCreator } from "../widgets.actions";
import { widgetsSelector } from "../widgets.selectors";

describe("[Saga] Widgets", () => {
  describe("pilot", () => {
    it("should trigger all the all widgets sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("GET_WIDGETS", fetchWidgets)
        .next()
        .takeLatest("SAVE_WIDGET", saveWidget)
        .next()
        .takeLatest("CREATE_WIDGET", createWidget)
        .next()
        .takeLatest("DELETE_WIDGET", deleteWidget)
        .next()
        .isDone();
    });
  });

  describe("fetch widgets saga", () => {
    it("should call api", () => {
      testSaga(fetchWidgets)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_WIDGETS))
        .next()
        .call(API.getWidgets)
        .next([{ _id: "id" }])
        .put(setWidgetsActionCreator([{ _id: "id" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_WIDGETS))
        .next()
        .isDone();
    });

    it("should call api put [] when getWidgets throw", () => {
      testSaga(fetchWidgets)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_WIDGETS))
        .next()
        .call(API.getWidgets)
        .throw(new Error("error"))
        .put(setWidgetsActionCreator([]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_WIDGETS))
        .next()
        .isDone();
    });
  });

  describe("save widgets saga", () => {
    it("should call api", () => {
      testSaga(saveWidget, {
        type: SAVE_WIDGET,
        payload: {
          id: "id3",
          value: { name: "new" }
        },
      })
        .next()
        .put(startLoading(LoadingStatusKey.SAVE_WIDGET))
        .next()
        .call(API.patchWidget, "id3", { name: "new" })
        .next({ _id: "id3", name: "new" })
        .select(widgetsSelector)
        .next([{ _id: "id1" }, { _id: "id2" }, { _id: "id3", name: "old" }])
        .put(setWidgetsActionCreator([{ _id: "id1" }, { _id: "id2" }, { _id: "id3", name: "new" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.SAVE_WIDGET))
        .next()
        .isDone();
    });
  });

  describe("create widgets saga", () => {
    it("should call api", () => {
      testSaga(createWidget, {
        type: CREATE_WIDGET,
        payload: { name: "new" },
      })
        .next()
        .put(startLoading(LoadingStatusKey.CREATE_WIDGET))
        .next()
        .call(API.postWidgets, { name: "new" })
        .next({ _id: "id3", name: "new" })
        .select(widgetsSelector)
        .next([{ _id: "id1" }, { _id: "id2" }])
        .put(setWidgetsActionCreator([{ _id: "id3", name: "new" }, { _id: "id1" }, { _id: "id2" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.CREATE_WIDGET))
        .next()
        .isDone();
    });
  });

  describe("delete widgets saga", () => {
    it("should call api", () => {
      testSaga(deleteWidget, {
        type: DELETE_WIDGET,
        payload: "id2",
      })
        .next()
        .put(startLoading(LoadingStatusKey.DELETE_WIDGET))
        .next()
        .call(API.deleteWidget, "id2")
        .next()
        .select(widgetsSelector)
        .next([{ _id: "id1" }, { _id: "id2" }])
        .put(setWidgetsActionCreator([{ _id: "id1" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.DELETE_WIDGET))
        .next()
        .isDone();
    });
  });
});
