/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import { fetchUserFavoritesActionCreator } from "./UserFavoritesInLocale.actions";
import { SagaIterator } from "redux-saga";
import { logger } from "../../logger";
import { put, call, takeLatest } from "redux-saga/effects";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import API from "../../utils/API";
import { setUserActionCreator } from "../User/user.actions";
import { FETCH_USER_FAVORITES } from "./UserFavoritesInLocale.actionTypes";

export function* fetchUserFavorites(
  action: ReturnType<typeof fetchUserFavoritesActionCreator>
): SagaIterator {
  try {
    logger.info("[fetchUserFavorites] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_USER_FAVORITES));
    const favorites = yield call(API.getUserFavoritesInLocale, action.payload);
    // eslint-disable-next-line no-console
    // console.log("favorites", favorites);
    // yield put(fetchUserActionCreator());
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_FAVORITES));
  } catch (error) {
    logger.error("[fetchUserFavorites] saga error", { error });
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_FAVORITES));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_USER_FAVORITES, fetchUserFavorites);
}

export default latestActionsSaga;
