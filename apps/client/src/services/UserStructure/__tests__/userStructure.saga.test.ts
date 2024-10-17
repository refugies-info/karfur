// @ts-nocheck
import mockRouter from "next-router-mock";
import { testSaga } from "redux-saga-test-plan";
import API from "../../../utils/API";
import { LoadingStatusKey, finishLoading, startLoading } from "../../LoadingStatus/loadingStatus.actions";
import { userSelector } from "../../User/user.selectors";
import { FETCH_USER_STRUCTURE, UPDATE_USER_STRUCTURE } from "../userStructure.actionTypes";
import { fetchUserStructureActionCreator, setUserStructureActionCreator } from "../userStructure.actions";
import latestActionsSaga, { fetchUserStructure, updateUserStructure } from "../userStructure.saga";
jest.mock("next/router", () => require("next-router-mock"));

describe("[Saga] Structures", () => {
  describe("pilot", () => {
    it("should trigger all the structures sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_USER_STRUCTURE", fetchUserStructure)
        .next()
        .takeLatest("UPDATE_USER_STRUCTURE", updateUserStructure)
        .next()
        .isDone();
    });
  });

  describe("fetch user structure saga", () => {
    it("should call api and push / when no membre if should redirect", () => {
      testSaga(fetchUserStructure, {
        type: FETCH_USER_STRUCTURE,
        payload: { structureId: "id", shouldRedirect: true },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", "fr")
        .next(null)
        .put(setUserStructureActionCreator(null))
        .next()
        .select(userSelector)
        .next({ userId: "userId" })
        .call(mockRouter.push, "/")
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call api and push / when no membre if should redirect", () => {
      testSaga(fetchUserStructure, {
        type: FETCH_USER_STRUCTURE,
        payload: { structureId: "id", shouldRedirect: false },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", "fr")
        .next(null)
        .put(setUserStructureActionCreator(null))
        .next()
        .select(userSelector)
        .next({ userId: "userId" })
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call api and push / when membre not admin or respo", () => {
      testSaga(fetchUserStructure, {
        type: FETCH_USER_STRUCTURE,
        payload: { structureId: "id", shouldRedirect: false },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", "fr")
        .next({ membres: [{ userId: "id" }] })
        .put(
          setUserStructureActionCreator({
            membres: [{ userId: "id" }],
          }),
        )
        .next()
        .select(userSelector)
        .next({ userId: "id" })
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call api and not push / when membre admin", () => {
      testSaga(fetchUserStructure, {
        type: FETCH_USER_STRUCTURE,
        payload: { structureId: "id", shouldRedirect: true },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", "fr")
        .next({
          membres: [{ userId: "id" }],
        })
        .put(
          setUserStructureActionCreator({
            membres: [{ userId: "id" }],
          }),
        )
        .next()
        .select(userSelector)
        .next({ userId: "id" })
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call api and not push / when membre admin", () => {
      testSaga(fetchUserStructure, {
        type: FETCH_USER_STRUCTURE,
        payload: { structureId: "id", shouldRedirect: false },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", "fr")
        .next({ membres: [{ userId: "id" }] })
        .put(
          setUserStructureActionCreator({
            membres: [{ userId: "id" }],
          }),
        )
        .next()
        .select(userSelector)
        .next({ userId: "id" })
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });
  });

  describe("updateUserStructure", () => {
    it("should call and dispatch correct actions with modifyMembres true action create", () => {
      testSaga(updateUserStructure, {
        type: UPDATE_USER_STRUCTURE,
        payload: {
          membres: {
            structureId: "structureId",
            userId: "userId",
            type: "create",
          },
        },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()
        .call(API.updateStructureMembers, "structureId", {
          membreId: "userId",
          action: "create",
        })
        .next()
        .put(
          fetchUserStructureActionCreator({
            structureId: "structureId",
            shouldRedirect: true,
          }),
        )
        .next()
        .put(finishLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call and dispatch correct actions with modifyMembres true but no data action create", () => {
      testSaga(updateUserStructure, {
        type: UPDATE_USER_STRUCTURE,
        payload: {
          membres: {
            type: "create",
          },
        },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()

        .isDone();
    });

    it("should call and dispatch correct actions with modifyMembres true action modify without newRole", () => {
      testSaga(updateUserStructure, {
        type: UPDATE_USER_STRUCTURE,
        payload: {
          membres: {
            structureId: "structureId",
            userId: "userId",
            type: "modify",
          },
        },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call and dispatch correct actions with modifyMembres true action delet", () => {
      testSaga(updateUserStructure, {
        type: UPDATE_USER_STRUCTURE,
        payload: {
          membres: {
            structureId: "structureId",
            userId: "userId",
            type: "delete",
          },
        },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()
        .call(API.updateStructureMembers, "structureId", {
          membreId: "userId",
          action: "delete",
        })
        .next()
        .put(
          fetchUserStructureActionCreator({
            structureId: "structureId",
            shouldRedirect: true,
          }),
        )
        .next()
        .put(finishLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()
        .isDone();
    });
  });
});
