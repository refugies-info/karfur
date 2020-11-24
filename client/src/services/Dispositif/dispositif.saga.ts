import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, select } from "redux-saga/effects";
import {langueSelector} from "../Langue/langue.selectors";
import API from "../../utils/API";
import { FETCH_DISPOSITIFS } from "./dispositif.actionTypes";
import { setDispositifsActionsCreator } from "./dispositif.actions";
import { logger } from "../../logger";

export function* fetchDispositifs(): SagaIterator {
  try {
    const langue = yield select(langueSelector)
    const data = yield call(API.get_dispositif, {
      query: { status: "Actif" },
      demarcheId: { $exists: false },
      locale: langue
    });
    yield put(setDispositifsActionsCreator(data.data.data));
  } catch (error) {
    logger.error("Error while fetching dispositifs", { error });
    yield put(setDispositifsActionsCreator([]));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_DISPOSITIFS, fetchDispositifs);
}

export default latestActionsSaga;
