//@ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, {
  fetchUserContributions,
  deleteContributionAndUpdate,
} from "../userContributions.saga";
import API from "../../../utils/API";
import {
  setUserContributionsActionCreator,
  fetchUserContributionsActionCreator,
} from "../userContributions.actions";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { DELETE_DISPOSITIF } from "../userContributions.actionTypes";

describe("[Saga] UserContributions", () => {
  describe("pilot", () => {
    it("should trigger all the user contributions sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_USER_CONTRIBUTIONS", fetchUserContributions)
        .next()
        .takeLatest("DELETE_DISPOSITIF", deleteContributionAndUpdate)
        .next()
        .isDone();
    });
  });

  describe("fetch user contributions saga", () => {
    it("should call get user contributions and set contributions", () => {
      testSaga(fetchUserContributions)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS))
        .next()
        .call(API.getUserContributions)
        .next({ data: { data: [{ _id: "id" }] } })
        .put(setUserContributionsActionCreator([{ _id: "id" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS))
        .next()
        .isDone();
    });

    it("should call call get contributions and set [] if throws", () => {
      testSaga(fetchUserContributions)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS))
        .next()
        .call(API.getUserContributions)
        .throw(new Error("test"))
        .put(setUserContributionsActionCreator([]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS))
        .next()
        .isDone();
    });
  });

  describe("delete contrib saga", () => {
    it("should call update dispositif and fetch contributions", () => {
      testSaga(deleteContributionAndUpdate, {
        type: DELETE_DISPOSITIF,
        payload: "dispoId",
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS))
        .next()
        .call(API.updateDispositifStatus, {
          query: { dispositifId: "dispoId", status: "Supprimé" },
        })
        .next()
        .put(fetchUserContributionsActionCreator())
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS))
        .next()
        .isDone();
    });

    it("should call call get contributions and set [] if throws", () => {
      testSaga(deleteContributionAndUpdate, {
        type: DELETE_DISPOSITIF,
        payload: "dispoId",
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS))
        .next()
        .call(API.updateDispositifStatus, {
          query: { dispositifId: "dispoId", status: "Supprimé" },
        })
        .throw(new Error("test"))
        .put(finishLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS))
        .next()
        .isDone();
    });
  });
});
