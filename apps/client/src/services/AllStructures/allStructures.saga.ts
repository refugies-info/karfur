import { GetAllStructuresResponse } from "@refugies-info/api-types";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { logger } from "../../logger";
import API from "../../utils/API";
import { LoadingStatusKey, finishLoading, startLoading } from "../LoadingStatus/loadingStatus.actions";
import { FETCH_ALL_STRUCTURES } from "./allStructures.actionTypes";
import { setAllStructuresActionCreator } from "./allStructures.actions";

export function* fetchAllStructures(): SagaIterator {
  try {
    logger.info("[fetchAllStructures saga]");
    yield put(startLoading(LoadingStatusKey.FETCH_ALL_STRUCTURES));
    const data: GetAllStructuresResponse[] = yield call(API.getAllStructures);
    yield put(setAllStructuresActionCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_STRUCTURES));
  } catch (error) {
    logger.error("[fetchAllStructures saga] Error while fetching structures", {
      error,
    });
    yield put(setAllStructuresActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_STRUCTURES));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_ALL_STRUCTURES, fetchAllStructures);
}

export default latestActionsSaga;
