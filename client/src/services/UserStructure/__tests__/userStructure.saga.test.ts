// @ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, {
  fetchUserStructure,
  updateUserStructure,
} from "../userStructure.saga";
import API from "../../../utils/API";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import {
  FETCH_USER_STRUCTURE,
  UPDATE_USER_STRUCTURE,
} from "../userStructure.actionTypes";
import {
  setUserStructureActionCreator,
  fetchUserStructureActionCreator,
} from "../userStructure.actions";
import { userSelector } from "../../User/user.selectors";
import { setUserRoleInStructureActionCreator } from "../../User/user.actions";
import { userStructureSelector } from "../userStructure.selectors";
import mockRouter from "next-router-mock";
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
        .put(setUserRoleInStructureActionCreator([]))
        .next()
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
        .put(setUserRoleInStructureActionCreator([]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call api and push / when membre not admin or respo", () => {
      testSaga(fetchUserStructure, {
        type: FETCH_USER_STRUCTURE,
        payload: { structureId: "id", shouldRedirect: true },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", "fr")
        .next({ membres: [{ userId: "id1", roles: ["membre"] }] })
        .put(
          setUserStructureActionCreator({
            membres: [{ userId: "id1", roles: ["membre"] }],
          })
        )
        .next()
        .select(userSelector)
        .next({ userId: "id1" })
        .put(setUserRoleInStructureActionCreator(["membre"]))
        .next()
        .call(mockRouter.push, "/")
        .next()
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
        .next({ membres: [{ userId: "id", roles: ["membre"] }] })
        .put(
          setUserStructureActionCreator({
            membres: [{ userId: "id", roles: ["membre"] }],
          })
        )
        .next()
        .select(userSelector)
        .next({ userId: "id" })
        .put(setUserRoleInStructureActionCreator(["membre"]))
        .next()
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
          membres: [{ userId: "id", roles: ["administrateur"] }]
        })
        .put(
          setUserStructureActionCreator({
            membres: [{ userId: "id", roles: ["administrateur"] }],
          })
        )
        .next()
        .select(userSelector)
        .next({ userId: "id" })
        .put(setUserRoleInStructureActionCreator(["administrateur"]))
        .next()
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
        .next({ membres: [{ userId: "id", roles: ["administrateur"] }] })
        .put(
          setUserStructureActionCreator({
            membres: [{ userId: "id", roles: ["administrateur"] }],
          })
        )
        .next()
        .select(userSelector)
        .next({ userId: "id" })
        .put(setUserRoleInStructureActionCreator(["administrateur"]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call api and not push / when membre contributeur", () => {
      testSaga(fetchUserStructure, {
        type: FETCH_USER_STRUCTURE,
        payload: { structureId: "id", shouldRedirect: true },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", "fr")
        .next({ membres: [{ userId: "id", roles: ["contributeur"] }] })
        .put(
          setUserStructureActionCreator({
            membres: [{ userId: "id", roles: ["contributeur"] }],
          })
        )
        .next()
        .select(userSelector)
        .next({ userId: "id" })
        .put(setUserRoleInStructureActionCreator(["contributeur"]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call api and not push / when membre contributeur", () => {
      testSaga(fetchUserStructure, {
        type: FETCH_USER_STRUCTURE,
        payload: { structureId: "id", shouldRedirect: false },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", "fr")
        .next({ membres: [{ userId: "id", roles: ["contributeur"] }] })
        .put(
          setUserStructureActionCreator({
            membres: [{ userId: "id", roles: ["contributeur"] }],
          })
        )
        .next()
        .select(userSelector)
        .next({ userId: "id" })
        .put(setUserRoleInStructureActionCreator(["contributeur"]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });
  });

  /*   const membres: {
      type: "modify" | "delete" | "create";
      userId: Id;
      structureId: Id;
      newRole?: "administrateur" | "contributeur" | undefined;
  } | undefined */

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
        .call(API.updateStructureRoles, "structureId", {
          membreId: "userId",
          action: "create",
          role: "contributeur",
        })
        .next()
        .put(
          fetchUserStructureActionCreator({
            structureId: "structureId",
            shouldRedirect: true,
          })
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
          }
        },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()

        .isDone();
    });

    it("should call and dispatch correct actions with modifyMembres true action modify", () => {
      testSaga(updateUserStructure, {
        type: UPDATE_USER_STRUCTURE,
        payload: {
          membres: {
            structureId: "structureId",
            userId: "userId",
            type: "modify",
            newRole: "administrateur",
          },
        },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()
        .call(API.updateStructureRoles, "structureId", {
          membreId: "userId",
          action: "modify",
          role: "administrateur",
        })
        .next()
        .put(
          fetchUserStructureActionCreator({
            structureId: "structureId",
            shouldRedirect: true,
          })
        )
        .next()
        .put(finishLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
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
        .call(API.updateStructureRoles, "structureId", {
          membreId: "userId",
          action: "delete",
        })
        .next()
        .put(
          fetchUserStructureActionCreator({
            structureId: "structureId",
            shouldRedirect: true,
          })
        )
        .next()
        .put(finishLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()
        .isDone();
    });
  });
});
