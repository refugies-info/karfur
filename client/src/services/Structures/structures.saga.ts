import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import API from "../../utils/API";
import { FETCH_STRUCTURES } from "./structures.actionTypes";
import { setStructuresActionCreator } from "./structures.actions";

export function* fetchStructures(): SagaIterator {
  try {
    const data = yield call(API.get_structure, { status: "Actif" });
    yield put(setStructuresActionCreator(data.data.data));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error while fetching structures", { error });
    yield put(setStructuresActionCreator([]));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_STRUCTURES, fetchStructures);
}

export default latestActionsSaga;
