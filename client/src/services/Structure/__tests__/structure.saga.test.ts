// @ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, {
  fetchUserStructure,
  updateUserStructure,
  fetchStructures,
} from "../structure.saga";
import API from "../../../utils/API";
import { push } from "connected-react-router";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { FETCH_USER_STRUCTURE } from "../structure.actionTypes";
import { setUserStructureActionCreator } from "../structure.actions";
import { userSelector } from "../../User/user.selectors";

describe("[Saga] Structures", () => {
  describe("pilot", () => {
    it("should trigger all the structures sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_STRUCTURES", fetchStructures)
        .next()
        .takeLatest("FETCH_USER_STRUCTURE", fetchUserStructure)
        .next()
        .takeLatest("UPDATE_USER_STRUCTURE", updateUserStructure)
        .next()
        .isDone();
    });
  });

  describe("fetch user structure saga", () => {
    it("should call api and push / when no membre", () => {
      testSaga(fetchUserStructure, {
        type: FETCH_USER_STRUCTURE,
        payload: { structureId: "id" },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", false)
        .next({ data: { data: null } })
        .put(setUserStructureActionCreator(null))
        .next()
        .select(userSelector)
        .next({ userId: "userId" })
        .put(push("/"))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call api and push / when membre not admin or respo", () => {
      testSaga(fetchUserStructure, {
        type: FETCH_USER_STRUCTURE,
        payload: { structureId: "id" },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", false)
        .next({
          data: { data: { membres: [{ userId: "id", roles: ["membre"] }] } },
        })
        .put(
          setUserStructureActionCreator({
            membres: [{ userId: "id", roles: ["membre"] }],
          })
        )
        .next()
        .select(userSelector)
        .next({ userId: "id" })
        .put(push("/"))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call api and not push / when membre admin", () => {
      testSaga(fetchUserStructure, {
        type: FETCH_USER_STRUCTURE,
        payload: { structureId: "id" },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", false)
        .next({
          data: {
            data: { membres: [{ userId: "id", roles: ["administrateur"] }] },
          },
        })
        .put(
          setUserStructureActionCreator({
            membres: [{ userId: "id", roles: ["administrateur"] }],
          })
        )
        .next()
        .select(userSelector)
        .next({ userId: "id" })
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });

    it("should call api and not push / when membre contributeur", () => {
      testSaga(fetchUserStructure, {
        type: FETCH_USER_STRUCTURE,
        payload: { structureId: "id" },
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .call(API.getStructureById, "id", false)
        .next({
          data: {
            data: { membres: [{ userId: "id", roles: ["contributeur"] }] },
          },
        })
        .put(
          setUserStructureActionCreator({
            membres: [{ userId: "id", roles: ["contributeur"] }],
          })
        )
        .next()
        .select(userSelector)
        .next({ userId: "id" })
        .put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE))
        .next()
        .isDone();
    });
  });
});
