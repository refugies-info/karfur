import { GetUserContributionsResponse } from "@refugies-info/api-types";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { logger } from "../../logger";
import API from "../../utils/API";
import { LoadingStatusKey, finishLoading, startLoading } from "../LoadingStatus/loadingStatus.actions";
import { DELETE_DISPOSITIF, FETCH_USER_CONTRIBUTIONS } from "./userContributions.actionTypes";
import {
  deleteDispositifActionCreator,
  fetchUserContributionsActionCreator,
  setUserContributionsActionCreator,
} from "./userContributions.actions";

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

export function* deleteContributionAndUpdate(action: ReturnType<typeof deleteDispositifActionCreator>): SagaIterator {
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
