import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { logger } from "~/logger";
import { getNeeds } from "~/utils/API";
import { finishLoading, LoadingStatusKey, startLoading } from "../LoadingStatus/loadingStatus.actions";
import { setNeedsActionCreator } from "./needs.actions";
import { FETCH_NEEDS } from "./needs.actionTypes";

export function* fetchNeeds(): SagaIterator {
  try {
    logger.info("[fetchNeeds] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_NEEDS));
    const data = yield call(getNeeds);
    if (data) {
      yield put(setNeedsActionCreator(data));
    }
    yield put(finishLoading(LoadingStatusKey.FETCH_NEEDS));
  } catch (error: any) {
    logger.error("Error while fetching needs", { error: error.message });
    yield put(setNeedsActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_NEEDS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_NEEDS, fetchNeeds);
}

export default latestActionsSaga;
