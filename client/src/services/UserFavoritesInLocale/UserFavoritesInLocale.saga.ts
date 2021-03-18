import {
  fetchUserFavoritesActionCreator,
  setUserFavoritesActionCreator,
} from "./UserFavoritesInLocale.actions";
import { SagaIterator } from "redux-saga";
import { logger } from "../../logger";
import { put, call, takeLatest } from "redux-saga/effects";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import API from "../../utils/API";
import { FETCH_USER_FAVORITES } from "./UserFavoritesInLocale.actionTypes";

export function* fetchUserFavorites(
  action: ReturnType<typeof fetchUserFavoritesActionCreator>
): SagaIterator {
  try {
    logger.info("[fetchUserFavorites] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_USER_FAVORITES));
    const data = yield call(API.getUserFavoritesInLocale, action.payload);
    yield put(setUserFavoritesActionCreator(data.data.data));
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
