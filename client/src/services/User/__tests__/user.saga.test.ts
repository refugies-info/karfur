import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, { fetchUser, saveUser } from "../user.saga";
import { FETCH_USER, SAVE_USER } from "../user.actionTypes";
import API from "../../../utils/API";
import { setUserActionCreator, fetchUserActionCreator } from "../user.actions";
import { testUser } from "../../../__fixtures__/user";
import { startLoading, LoadingStatusKey, finishLoading } from "../../LoadingStatus/loadingStatus.actions";
import { fetchUserStructureActionCreator } from "../../UserStructure/userStructure.actions";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => require("next-router-mock"));

describe("[Saga] User", () => {
  describe("pilot", () => {
    it("should trigger all the user sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_USER", fetchUser)
        .next()
        .takeLatest("SAVE_USER", saveUser)
        .next()
        .isDone();
    });
  });

  describe("fetch user saga", () => {
    it("should call api.isAuth and dispatch set user action with null payload if not authentified", () => {
      testSaga(fetchUser, { type: FETCH_USER, payload: undefined })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER))
        .next()
        .call(API.isAuth)
        .next(false)
        .put(setUserActionCreator(null))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER))
        .next()
        .isDone();
    });

    it("should call api.isAuth and dispatch set user action with user in payload if authentified", () => {
      testSaga(fetchUser, { type: FETCH_USER, payload: undefined })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER))
        .next()
        .call(API.isAuth)
        .next(true)
        .call(API.getUser, { token: undefined })
        .next({ ...testUser, structures: ["testObjectId"] })
        .put(setUserActionCreator({ ...testUser, structures: ["testObjectId"] }))
        .next()
        .put(
          fetchUserStructureActionCreator({
            structureId: "testObjectId",
            shouldRedirect: false
          })
        )
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER))
        .next()
        .isDone();
    });

    it("should call api.isAuth and dispatch set user action with null payload if api.isAuth throws an error", () => {
      testSaga(fetchUser, { type: FETCH_USER, payload: undefined })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER))
        .next()
        .call(API.isAuth)
        .throw(new Error("test"))
        .put(setUserActionCreator(null))
        .next()
        .isDone();
    });

    it("should call api.isAuth, api.getUser and dispatch set user action with null payload if api.getUser throws an error", () => {
      testSaga(fetchUser, { type: FETCH_USER, payload: undefined })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER))
        .next()
        .call(API.isAuth)
        .next(true)
        .call(API.getUser, { token: undefined })
        .throw(new Error("test"))
        .put(setUserActionCreator(null))
        .next()
        .isDone();
    });
  });

  describe("save user saga", () => {
    it("should call update user and fetch user", () => {
      testSaga(saveUser, {
        type: SAVE_USER,
        payload: { id: "id", value: { user: { email: "new" }, action: "modify-my-details" } }
      })
        .next()
        .put(startLoading(LoadingStatusKey.SAVE_USER))
        .next()
        .call(API.updateUser, "id", { user: { email: "new" }, action: "modify-my-details" })
        .next()
        .put(fetchUserActionCreator())
        .next()
        .put(finishLoading(LoadingStatusKey.SAVE_USER))
        .next()
        .isDone();
    });

    it("should call update user and set user null if update user throws", () => {
      testSaga(saveUser, {
        type: SAVE_USER,
        payload: { id: "id", value: { user: { email: "new" }, action: "modify-my-details" } }
      })
        .next()
        .put(startLoading(LoadingStatusKey.SAVE_USER))
        .next()
        .call(API.updateUser, "id", { user: { email: "new" }, action: "modify-my-details" })
        .throw(new Error("test"))
        .put(setUserActionCreator(null))
        .next()
        .put(finishLoading(LoadingStatusKey.SAVE_USER))
        .next()
        .isDone();
    });
  });
});
