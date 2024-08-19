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
  FETCH_USER_CONTRIBUTIONS,
  DELETE_DISPOSITIF,
} from "./userContributions.actionTypes";
import {
  setUserContributionsActionCreator,
  deleteDispositifActionCreator,
  fetchUserContributionsActionCreator,
} from "./userContributions.actions";
import { GetUserContributionsResponse } from "@refugies-info/api-types";

export function* fetchUserContributions(): SagaIterator {
  try {
    logger.info("[fetchUserContributions] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS));
    const data: GetUserContributionsResponse[] = yield call(API.getUserContributions);
    yield put(setUserContributionsActionCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS));
  } catch (error) {
    logger.error("[fetchUserContributions] saga error", { error });
    yield put(setUserContributionsActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS));
  }
}

export function* deleteContributionAndUpdate(
  action: ReturnType<typeof deleteDispositifActionCreator>
): SagaIterator {
  try {
    logger.info("[deleteContributionAndUpdate] saga", { data: action.payload });
    yield put(startLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS));
    yield call(API.deleteDispositif, action.payload);
    yield put(fetchUserContributionsActionCreator());
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS));
  } catch (error) {
    logger.error("[deleteContributionAndUpdate] saga error", { error });
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_USER_CONTRIBUTIONS, fetchUserContributions);
  yield takeLatest(DELETE_DISPOSITIF, deleteContributionAndUpdate);
}

export default latestActionsSaga;
