import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import API from "../../utils/API";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { setAllUsersActionsCreator } from "./allUsers.actions";
import { FETCH_ALL_USERS } from "./allUsers.actionTypes";
import { GetAllUsersResponse } from "@refugies-info/api-types";

export function* fetchAllUsers(): SagaIterator {
  try {
    logger.info("[fetchAllUsers saga]");
    yield put(startLoading(LoadingStatusKey.FETCH_ALL_USERS));
    const data: GetAllUsersResponse[] = yield call(API.getAllUsers);
    yield put(setAllUsersActionsCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_USERS));
  } catch (error) {
    logger.error("[fetchAllUsers saga] Error while fetching dispositifs", {
      error,
    });
    yield put(setAllUsersActionsCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_USERS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_ALL_USERS, fetchAllUsers);
}

export default latestActionsSaga;
