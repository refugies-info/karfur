import {
  fetchUserFavoritesActionCreator,
  setUserFavoritesActionCreator,
  updateUserFavoritesActionCreator,
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
import {
  FETCH_USER_FAVORITES,
  UPDATE_USER_FAVORITES,
} from "./UserFavoritesInLocale.actionTypes";

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
    yield put(setUserFavoritesActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_FAVORITES));
  }
}

export function* updateUserFavorites(
  action: ReturnType<typeof updateUserFavoritesActionCreator>
): SagaIterator {
  try {
    logger.info("[updateUserFavorites] saga", { data: action.payload });
    yield put(startLoading(LoadingStatusKey.UPDATE_USER_FAVORITES));
    yield call(API.updateUserFavorites, {
      dispositifId: action.payload.dispositifId,
      type: action.payload.type,
    });
    yield put(fetchUserFavoritesActionCreator(action.payload.locale));
    yield put(finishLoading(LoadingStatusKey.UPDATE_USER_FAVORITES));
  } catch (error) {
    logger.error("[updateUserFavorites] saga error", { error });
    yield put(finishLoading(LoadingStatusKey.UPDATE_USER_FAVORITES));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_USER_FAVORITES, fetchUserFavorites);
  yield takeLatest(UPDATE_USER_FAVORITES, updateUserFavorites);
}

export default latestActionsSaga;
