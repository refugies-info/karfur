import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import API from "../../utils/API";
import { FETCH_LANGUES } from "./langue.actionTypes";
import { setLanguesActionCreator } from "./langue.actions";

export function* fetchLangues(): SagaIterator {
  try {
    const data = yield call(
      API.get_langues,
      {},
      { avancement: -1, langueFr: 1 }
    );
    yield put(setLanguesActionCreator(data.data.data));
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
