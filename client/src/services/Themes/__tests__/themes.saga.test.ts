// @ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, {
  fetchThemes,
  saveTheme,
  createTheme,
  deleteTheme
} from "../themes.saga";
import {
  DELETE_THEME,
  SAVE_THEME,
  CREATE_THEME,
} from "../themes.actionTypes";
import API from "../../../utils/API";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
  setError,
} from "../../LoadingStatus/loadingStatus.actions";
import { setThemesActionCreator } from "../themes.actions";
import { allThemesSelector } from "../themes.selectors";

describe("[Saga] Themes", () => {
  describe("pilot", () => {
    it("should trigger all the all themes sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("GET_THEMES", fetchThemes)
        .next()
        .takeLatest("SAVE_THEME", saveTheme)
        .next()
        .takeLatest("CREATE_THEME", createTheme)
        .next()
        .takeLatest("DELETE_THEME", deleteTheme)
        .next()
        .isDone();
    });
  });

  describe("fetch themes saga", () => {
    it("should call api", () => {
      testSaga(fetchThemes)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_THEMES))
        .next()
        .call(API.getThemes)
        .next([{ _id: "id" }])
        .put(setThemesActionCreator([{ _id: "id" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_THEMES))
        .next()
        .isDone();
    });

    it("should call api put [] when getThemes throw", () => {
      testSaga(fetchThemes)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_THEMES))
        .next()
        .call(API.getThemes)
        .throw(new Error("error"))
        .put(setThemesActionCreator([]))
        .next()
        .put(setError(LoadingStatusKey.FETCH_THEMES, "Error while fetching"))
        .next()
        .isDone();
    });
  });

  describe("save themes saga", () => {
    it("should call api", () => {
      testSaga(saveTheme, {
        type: SAVE_THEME,
        payload: {
          value: {
            name: "new"
          },
          id: "id3"
        },
      })
        .next()
        .put(startLoading(LoadingStatusKey.SAVE_THEME))
        .next()
        .call(API.patchTheme, "id3", {
          name: "new"
        })
        .next({ _id: "id3", name: "new" })
        .select(allThemesSelector)
        .next([{ _id: "id1" }, { _id: "id2" }, { _id: "id3", name: "old" }])
        .put(setThemesActionCreator([{ _id: "id1" }, { _id: "id2" }, { _id: "id3", name: "new" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.SAVE_THEME))
        .next()
        .isDone();
    });
  });

  describe("create themes saga", () => {
    it("should call api", () => {
      testSaga(createTheme, {
        type: CREATE_THEME,
        payload: {
          _id: "id3",
          name: "new"
        },
      })
        .next()
        .put(startLoading(LoadingStatusKey.CREATE_THEME))
        .next()
        .call(API.postThemes, {
          _id: "id3",
          name: "new"
        })
        .next({ _id: "id3", name: "new" })
        .select(allThemesSelector)
        .next([{ _id: "id1" }, { _id: "id2" }])
        .put(setThemesActionCreator([{ _id: "id3", name: "new" }, { _id: "id1" }, { _id: "id2" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.CREATE_THEME))
        .next()
        .isDone();
    });
  });

  describe("delete themes saga", () => {
    it("should call api", () => {
      testSaga(deleteTheme, {
        type: DELETE_THEME,
        payload: "id2",
      })
        .next()
        .put(startLoading(LoadingStatusKey.DELETE_THEME))
        .next()
        .call(API.deleteTheme, "id2")
        .next()
        .select(allThemesSelector)
        .next([{ _id: "id1" }, { _id: "id2" }])
        .put(setThemesActionCreator([{ _id: "id1" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.DELETE_THEME))
        .next()
        .isDone();
    });
  });
});
