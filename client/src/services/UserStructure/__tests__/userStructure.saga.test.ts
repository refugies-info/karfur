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
        .call(API.getStructureById, "id", true, "fr", true)
        .next({ data: { data: null } })
        .put(setUserStructureActionCreator(null))
        .next()
        .select(userSelector)
        .next({ userId: "userId" })
        .put(setUserRoleInStructureActionCreator([]))
        .next()
        .put(push("/"))
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
        .call(API.getStructureById, "id", true, "fr", true)
        .next({ data: { data: null } })
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
        .call(API.getStructureById, "id", true, "fr", true)
        .next({
          data: { data: { membres: [{ _id: "id", roles: ["membre"] }] } },
        })
        .put(
          setUserStructureActionCreator({
            membres: [{ _id: "id", roles: ["membre"] }],
          })
        )
        .next()
        .select(userSelector)
        .next({ userId: "id" })
        .put(setUserRoleInStructureActionCreator(["membre"]))
        .next()
        .put(push("/"))
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
        .call(API.getStructureById, "id", true, "fr", true)
        .next({
          data: { data: { membres: [{ _id: "id", roles: ["membre"] }] } },
        })
        .put(
          setUserStructureActionCreator({
            membres: [{ _id: "id", roles: ["membre"] }],
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
        .call(API.getStructureById, "id", true, "fr", true)
        .next({
          data: {
            data: { membres: [{ _id: "id", roles: ["administrateur"] }] },
          },
        })
        .put(
          setUserStructureActionCreator({
            membres: [{ _id: "id", roles: ["administrateur"] }],
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
        .call(API.getStructureById, "id", true, "fr", true)
        .next({
          data: {
            data: { membres: [{ _id: "id", roles: ["administrateur"] }] },
          },
        })
        .put(
          setUserStructureActionCreator({
            membres: [{ _id: "id", roles: ["administrateur"] }],
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
        .call(API.getStructureById, "id", true, "fr", true)
        .next({
          data: {
            data: { membres: [{ _id: "id", roles: ["contributeur"] }] },
          },
        })
        .put(
          setUserStructureActionCreator({
            membres: [{ _id: "id", roles: ["contributeur"] }],
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
        .call(API.getStructureById, "id", true, "fr", true)
        .next({
          data: {
            data: { membres: [{ _id: "id", roles: ["contributeur"] }] },
          },
        })
        .put(
          setUserStructureActionCreator({
            membres: [{ _id: "id", roles: ["contributeur"] }],
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

  describe("updateUserStructure", () => {
    it("should call and dispatch correct actions if no structure and modifyMembres false", () => {
      testSaga(updateUserStructure, {
        type: UPDATE_USER_STRUCTURE,
        payload: { modifyMembres: false },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()
        .select(userStructureSelector)
        .next(null)
        .isDone();
    });

    it("should call and dispatch correct actions if structure and modifyMembres false", () => {
      testSaga(updateUserStructure, {
        type: UPDATE_USER_STRUCTURE,
        payload: { modifyMembres: false },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()
        .select(userStructureSelector)
        .next({ _id: "structureId", membres: "membres" })
        .call(API.updateStructure, { query: { _id: "structureId" } })
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

    it("should call and dispatch correct actions with modifyMembres true action create", () => {
      testSaga(updateUserStructure, {
        type: UPDATE_USER_STRUCTURE,
        payload: {
          modifyMembres: true,
          data: {
            structureId: "structureId",
            userId: "userId",
            type: "create",
          },
        },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()
        .call(API.modifyUserRoleInStructure, {
          query: {
            membreId: "userId",
            structureId: "structureId",
            action: "create",
            role: "contributeur",
          },
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
          modifyMembres: true,
          type: "create",
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
          modifyMembres: true,
          data: {
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
        .call(API.modifyUserRoleInStructure, {
          query: {
            membreId: "userId",
            structureId: "structureId",
            action: "modify",
            role: "administrateur",
          },
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
          modifyMembres: true,
          data: {
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
          modifyMembres: true,
          data: {
            structureId: "structureId",
            userId: "userId",
            type: "delete",
          },
        },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE))
        .next()
        .call(API.modifyUserRoleInStructure, {
          query: {
            membreId: "userId",
            structureId: "structureId",
            action: "delete",
          },
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
