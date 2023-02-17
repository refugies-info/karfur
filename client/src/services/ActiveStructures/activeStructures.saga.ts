import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import API from "../../utils/API";
import { logger } from "../../logger";
import { startLoading, LoadingStatusKey, finishLoading } from "../LoadingStatus/loadingStatus.actions";
import { setActiveStructuresActionCreator } from "./activeStructures.actions";
import { FETCH_ACTIVE_STRUCTURES } from "./activeStructures.actionTypes";
import { GetActiveStructuresResponse } from "api-types";
import { APIResponse } from "types/interface";

export function* fetchActiveStructures(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_STRUCTURES));
    logger.info("[fetchActiveStructures] fetching structures");
    const data: APIResponse<GetActiveStructuresResponse[]> = yield call(API.getActiveStructures);
    yield put(setActiveStructuresActionCreator(data.data.data));
    yield put(finishLoading(LoadingStatusKey.FETCH_STRUCTURES));
  } catch (error) {
    logger.error("[fetchActiveStructures] Error while fetching structures", {
      error
    });
    yield put(setActiveStructuresActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_STRUCTURES));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_ACTIVE_STRUCTURES, fetchActiveStructures);
}

export default latestActionsSaga;
