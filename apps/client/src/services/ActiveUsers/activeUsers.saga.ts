import { GetActiveUsersResponse } from "@refugies-info/api-types";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { logger } from "../../logger";
import API from "../../utils/API";
import { LoadingStatusKey, finishLoading, startLoading } from "../LoadingStatus/loadingStatus.actions";
import { setActiveUsersActionCreator } from "./activeUsers.actions";
import { FETCH_ACTIVE_USERS } from "./activeUsers.actionTypes";

export function* fetchActiveUsers(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_USERS));
    logger.info("[fetchActiveUsers] fetching users");
    const data: GetActiveUsersResponse[] = yield call(API.getActiveUsers);
    yield put(setActiveUsersActionCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_USERS));
  } catch (error) {
    logger.error("[fetchActiveUsers] Error while fetching users", {
      error,
    });
    yield put(setActiveUsersActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_USERS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_ACTIVE_USERS, fetchActiveUsers);
}

export default latestActionsSaga;
