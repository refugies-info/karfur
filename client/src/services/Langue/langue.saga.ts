import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, all } from "redux-saga/effects";
import API from "../../utils/API";
import { FETCH_LANGUES, TOGGLE_LANGUE } from "./langue.actionTypes";
import { setLanguesActionCreator } from "./langue.actions";
import {
  startLoading,
  finishLoading,
  LoadingStatusKey,
  setError,
} from "../LoadingStatus/loadingStatus.actions";
import { fetchActiveDispositifsActionsCreator } from "../ActiveDispositifs/activeDispositifs.actions";
import { logger } from "../../logger";

export function* fetchLangues(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_LANGUES));
    const data = yield call(API.getLanguages);
    yield put(setLanguesActionCreator(data.data.data));
    yield put(finishLoading(LoadingStatusKey.FETCH_LANGUES));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while fetching langues", { error: message });
    yield put(setLanguesActionCreator([]));
    yield put(setError(LoadingStatusKey.FETCH_LANGUES, "Error while fetching langues"));
  }
}

export function* toggleLangue(): SagaIterator {
  try {
    yield put(fetchActiveDispositifsActionsCreator());
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while setting dispositifs", { error: message });
  }
}

function* latestActionsSaga() {
  yield all([
    takeLatest(FETCH_LANGUES, fetchLangues),
    takeLatest(TOGGLE_LANGUE, toggleLangue),
  ]);
}

export default latestActionsSaga;
