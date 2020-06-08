import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import API from "../../utils/API";
import { FETCH_DISPOSITIFS } from "./dispositif.actionTypes";
import { setDispositifsActionsCreator } from "./dispositif.actions";

export function* fetchDispositifs(): SagaIterator {
  try {
    const data = yield call(API.get_dispositif, {
      query: { status: "Actif" },
      demarcheId: { $exists: false },
    });
    yield put(setDispositifsActionsCreator(data.data.data));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error while fetching dispositifs", { error });
    yield put(setDispositifsActionsCreator([]));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_DISPOSITIFS, fetchDispositifs);
}

export default latestActionsSaga;
