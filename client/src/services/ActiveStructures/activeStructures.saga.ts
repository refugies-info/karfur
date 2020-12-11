import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import API from "../../utils/API";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { setStructuresNewActionCreator } from "./activeStructures.actions";
import { FETCH_STRUCTURES_NEW } from "./activeStructures.actionTypes";

export function* fetchStructures(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_STRUCTURES));
    logger.info("[fetchStructures] fetching structures");
    const data = yield call(API.getActiveStructures);
    yield put(setStructuresNewActionCreator(data.data.data));
    yield put(finishLoading(LoadingStatusKey.FETCH_STRUCTURES));
  } catch (error) {
    logger.error("[fetchStructures] Error while fetching structures", {
      error,
    });
    yield put(setStructuresNewActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_STRUCTURES));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_STRUCTURES_NEW, fetchStructures);
}

export default latestActionsSaga;
