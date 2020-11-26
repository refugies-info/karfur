import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, select } from "redux-saga/effects";
import { langueSelector } from "../Langue/langue.selectors";
import API from "../../utils/API";
import { FETCH_DISPOSITIFS } from "./activeDispositifs.actionTypes";
import { setDispositifsActionsCreator } from "./activeDispositifs.actions";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";

export function* fetchDispositifs(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_DISPOSITIFS));

    const langue = yield select(langueSelector);
    const data = yield call(API.getDispositifs, {
      query: { status: "Actif" },
      demarcheId: { $exists: false },
      locale: langue,
    });

    yield put(setDispositifsActionsCreator(data.data.data));
    yield put(finishLoading(LoadingStatusKey.FETCH_DISPOSITIFS));
  } catch (error) {
    logger.error("Error while fetching dispositifs", { error });
    yield put(setDispositifsActionsCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_DISPOSITIFS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_DISPOSITIFS, fetchDispositifs);
}

export default latestActionsSaga;
