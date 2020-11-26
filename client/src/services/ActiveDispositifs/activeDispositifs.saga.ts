import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, select } from "redux-saga/effects";
import { langueSelector } from "../Langue/langue.selectors";
import API from "../../utils/API";
import { FETCH_ACTIVE_DISPOSITIFS } from "./activeDispositifs.actionTypes";
import { setActiveDispositifsActionsCreator } from "./activeDispositifs.actions";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";

export function* fetchActiveDispositifs(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));

    const langue = yield select(langueSelector);
    const data = yield call(API.getDispositifs, {
      query: { status: "Actif" },
      demarcheId: { $exists: false },
      locale: langue,
    });

    yield put(setActiveDispositifsActionsCreator(data.data.data));
    yield put(finishLoading(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));
  } catch (error) {
    logger.error("Error while fetching dispositifs", { error });
    yield put(setActiveDispositifsActionsCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_ACTIVE_DISPOSITIFS, fetchActiveDispositifs);
}

export default latestActionsSaga;
