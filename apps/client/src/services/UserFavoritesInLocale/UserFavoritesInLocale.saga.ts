import { DeleteUserFavoriteRequest, GetUserFavoritesResponse } from "@refugies-info/api-types";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { logger } from "../../logger";
import API from "../../utils/API";
import { LoadingStatusKey, finishLoading, startLoading } from "../LoadingStatus/loadingStatus.actions";
import {
  fetchUserFavoritesActionCreator,
  setUserFavoritesActionCreator,
  updateUserFavoritesActionCreator,
} from "./UserFavoritesInLocale.actions";
import { FETCH_USER_FAVORITES, UPDATE_USER_FAVORITES } from "./UserFavoritesInLocale.actionTypes";

export function* fetchUserFavorites(action: ReturnType<typeof fetchUserFavoritesActionCreator>): SagaIterator {
  try {
    logger.info("[fetchUserFavorites] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_USER_FAVORITES));
    const data: GetUserFavoritesResponse[] = yield call(API.getUserFavorites, { locale: action.payload });
    yield put(setUserFavoritesActionCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_FAVORITES));
  } catch (error) {
    logger.error("[fetchUserFavorites] saga error", { error });
    yield put(setUserFavoritesActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_FAVORITES));
  }
}

export function* updateUserFavorites(action: ReturnType<typeof updateUserFavoritesActionCreator>): SagaIterator {
  try {
    logger.info("[updateUserFavorites] saga", { data: action.payload });
    yield put(startLoading(LoadingStatusKey.UPDATE_USER_FAVORITES));
    const params: DeleteUserFavoriteRequest = {};
    if (action.payload.type === "remove-all") params.all = true;
    if (action.payload.dispositifId) params.dispositifId = action.payload.dispositifId.toString();
    yield call(API.deleteUserFavorites, params);
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
