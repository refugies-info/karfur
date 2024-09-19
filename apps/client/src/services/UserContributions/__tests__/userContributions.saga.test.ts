//@ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import API from "../../../utils/API";
import { LoadingStatusKey, finishLoading, startLoading } from "../../LoadingStatus/loadingStatus.actions";
import { fetchUserContributionsActionCreator, setUserContributionsActionCreator } from "../userContributions.actions";
import { DELETE_DISPOSITIF } from "../userContributions.actionTypes";
import latestActionsSaga, { deleteContributionAndUpdate, fetchUserContributions } from "../userContributions.saga";

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
        .next([{ _id: "id" }])
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
        .call(API.deleteDispositif, "dispoId")
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
        .call(API.deleteDispositif, "dispoId")
        .throw(new Error("test"))
        .put(finishLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS))
        .next()
        .isDone();
    });
  });
});
