import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, all } from "redux-saga/effects";
import API from "../../utils/API";
import { FETCH_LANGUES, TOGGLE_LANGUE } from "./langue.actionTypes";
import { setLanguesActionCreator } from "./langue.actions";
import {
  startLoading,
  finishLoading,
  LoadingStatusKey,
} from "../LoadingStatus/loadingStatus.actions";
import { fetchDispositifsActionCreator } from "../Dispositif/dispositif.actions";

export function* fetchLangues(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_LANGUES));
    const data = yield call(API.getLanguages);
    yield put(setLanguesActionCreator(data.data.data));
    yield put(finishLoading(LoadingStatusKey.FETCH_LANGUES));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error while fetching langues", { error });
    yield put(setLanguesActionCreator([]));
  }
}

export function* toggleLangue(): SagaIterator {
  try {
    yield put(fetchDispositifsActionCreator());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error while setting dispositifs", { error });
  }
}

function* latestActionsSaga() {
  yield all([
    takeLatest(FETCH_LANGUES, fetchLangues),
    takeLatest(TOGGLE_LANGUE, toggleLangue)
  ]);
}

export default latestActionsSaga;
