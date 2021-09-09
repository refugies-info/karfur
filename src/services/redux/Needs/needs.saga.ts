import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import {
  startLoading,
  finishLoading,
  LoadingStatusKey,
} from "../LoadingStatus/loadingStatus.actions";
import { logger } from "../../../logger";
import { setNeedsActionCreator } from "./needs.actions";
import { FETCH_NEEDS } from "./needs.actionTypes";
import { getNeeds } from "../../../utils/API";

export function* fetchNeeds(): SagaIterator {
  try {
    logger.info("[fetchNeeds] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_NEEDS));
    const data = yield call(getNeeds);
    if (data && data.data && data.data.data) {
      yield put(setNeedsActionCreator(data.data.data));
      yield put(finishLoading(LoadingStatusKey.FETCH_NEEDS));
    }
    yield put(finishLoading(LoadingStatusKey.FETCH_NEEDS));
  } catch (error) {
    logger.error("Error while fetching needs", { error: error.message });
    yield put(setNeedsActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_NEEDS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_NEEDS, fetchNeeds);
}

export default latestActionsSaga;
