import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import API from "../../utils/API";
import { FETCH_ALL_DISPOSITIFS } from "./allDispositifs.actionTypes";
import { setAllDispositifsActionsCreator } from "./allDispositifs.actions";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { GetAllDispositifsResponse } from "api-types";

export function* fetchAllDispositifs(): SagaIterator {
  try {
    logger.info("[fetchAllDispositifs saga]");
    yield put(startLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
    const data: GetAllDispositifsResponse[] = yield call(API.getAllDispositifs);
    yield put(setAllDispositifsActionsCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
  } catch (error) {
    logger.error(
      "[fetchAllDispositifs saga] Error while fetching dispositifs",
      { error }
    );
    yield put(setAllDispositifsActionsCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_ALL_DISPOSITIFS, fetchAllDispositifs);
}

export default latestActionsSaga;
