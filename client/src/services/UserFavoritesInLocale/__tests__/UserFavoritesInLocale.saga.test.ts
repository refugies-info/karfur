//@ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, {
  fetchUserFavorites,
  updateUserFavorites,
} from "../UserFavoritesInLocale.saga";
import { FETCH_USER, SAVE_USER } from "../user.actionTypes";
import API from "../../../utils/API";
import {
  fetchUserFavoritesActionCreator,
  setUserFavoritesActionCreator,
} from "../UserFavoritesInLocale.actions";
import { testUser } from "../../../__fixtures__/user";
// import { push } from "connected-react-router";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { fetchUserStructureActionCreator } from "../../UserStructure/userStructure.actions";
import {
  UPDATE_USER_FAVORITES,
  FETCH_USER_FAVORITES,
} from "../UserFavoritesInLocale.actionTypes";

describe("[Saga] UserFavorites", () => {
  describe("pilot", () => {
    it("should trigger all the user favoris sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_USER_FAVORITES", fetchUserFavorites)
        .next()
        .takeLatest("UPDATE_USER_FAVORITES", updateUserFavorites)
        .next()
        .isDone();
    });
  });

  describe("save user favorites saga", () => {
    it("should call update user favorites and fetch user favorites", () => {
      testSaga(updateUserFavorites, {
        type: UPDATE_USER_FAVORITES,
        payload: { dispositifId: "id", type: "remove", locale: "fr" },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_USER_FAVORITES))
        .next()
        .call(API.updateUserFavorites, {
          dispositifId: "id",
          type: "remove",
        })
        .next()
        .put(fetchUserFavoritesActionCreator("fr"))
        .next()
        .put(finishLoading(LoadingStatusKey.UPDATE_USER_FAVORITES))
        .next()
        .isDone();
    });

    it("should call update user fav if update user throws", () => {
      testSaga(updateUserFavorites, {
        type: UPDATE_USER_FAVORITES,
        payload: { dispositifId: "id", type: "remove", locale: "fr" },
      })
        .next()
        .put(startLoading(LoadingStatusKey.UPDATE_USER_FAVORITES))
        .next()
        .call(API.updateUserFavorites, {
          dispositifId: "id",
          type: "remove",
        })
        .throw(new Error("test"))
        .put(finishLoading(LoadingStatusKey.UPDATE_USER_FAVORITES))
        .next()
        .isDone();
    });
  });

  describe("fetch user favorites saga", () => {
    it("should call get user favorites and set favorites", () => {
      testSaga(fetchUserFavorites, {
        type: FETCH_USER_FAVORITES,
        payload: "fr",
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_FAVORITES))
        .next()
        .call(API.getUserFavoritesInLocale, "fr")
        .next({ data: { data: [{ _id: "id" }] } })
        .put(setUserFavoritesActionCreator([{ _id: "id" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER_FAVORITES))
        .next()
        .isDone();
    });

    it("should call call get user fav and set [] if throws", () => {
      testSaga(fetchUserFavorites, {
        type: FETCH_USER_FAVORITES,
        payload: "fr",
      })
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_USER_FAVORITES))
        .next()
        .call(API.getUserFavoritesInLocale, "fr")
        .throw(new Error("test"))
        .put(setUserFavoritesActionCreator([]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_USER_FAVORITES))
        .next()
        .isDone();
    });
  });
});
