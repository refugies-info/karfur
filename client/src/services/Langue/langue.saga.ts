import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import API from "../../utils/API";
import { FETCH_LANGUES } from "./langue.actionTypes";
import { setLanguesActionCreator } from "./langue.actions";
import {
  startLoading,
  finishLoading,
  LoadingStatusKey,
} from "../LoadingStatus/loadingStatus.actions";

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

function* latestActionsSaga() {
  yield takeLatest(FETCH_LANGUES, fetchLangues);
}

export default latestActionsSaga;
