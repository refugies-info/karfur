import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import API from "../../utils/API";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { FETCH_SELECTED_STRUCTURE } from "./selectedStructure.actionTypes";
import {
  fetchSelectedStructureActionCreator,
  setSelectedStructureActionCreator,
} from "./selectedStructure.actions";

export function* fetchSelectedStructure(
  action: ReturnType<typeof fetchSelectedStructureActionCreator>
): SagaIterator {
  try {
    const { id, locale } = action.payload;
    yield put(startLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE));
    logger.info("[fetchSelectedStructure] fetching structure", { id, locale });
    const data = yield call(API.getStructureById, id, true, locale, false);
    yield put(setSelectedStructureActionCreator(data.data.data));
    yield put(finishLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE));
  } catch (error) {
    logger.error("[fetchSelectedStructure] Error while fetching structure", {
      error,
    });
    yield put(setSelectedStructureActionCreator(null));
    yield put(finishLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_SELECTED_STRUCTURE, fetchSelectedStructure);
}

export default latestActionsSaga;
