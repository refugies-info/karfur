import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import API from "../../utils/API";
import { logger } from "../../logger";
import { startLoading, LoadingStatusKey, finishLoading } from "../LoadingStatus/loadingStatus.actions";
import { setActiveUsersActionCreator } from "./activeUsers.actions";
import { FETCH_ACTIVE_USERS } from "./activeUsers.actionTypes";
import { GetActiveUsersResponse } from "@refugies-info/api-types";

export function* fetchActiveUsers(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_USERS));
    logger.info("[fetchActiveUsers] fetching structures");
    const data: GetActiveUsersResponse[] = yield call(API.getActiveUsers);
    yield put(setActiveUsersActionCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_USERS));
  } catch (error) {
    logger.error("[fetchActiveUsers] Error while fetching structures", {
      error
    });
    yield put(setActiveUsersActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_USERS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_ACTIVE_USERS, fetchActiveUsers);
}

export default latestActionsSaga;
