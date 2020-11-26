import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, select } from "redux-saga/effects";
import { langueSelector } from "../Langue/langue.selectors";
import API from "../../utils/API";
import { FETCH_ALL_DISPOSITIFS } from "./allDispositifs.actionTypes";
import { setAllDispositifsActionsCreator } from "./allDispositifs.actions";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";

export function* fetchAllDispositifs(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));

    const langue = yield select(langueSelector);
    const data = yield call(API.getDispositifs, {
      query: {},
      demarcheId: { $exists: false },
      locale: langue,
    });

    yield put(setAllDispositifsActionsCreator(data.data.data));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
  } catch (error) {
    logger.error("Error while fetching dispositifs", { error });
    yield put(setAllDispositifsActionsCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_ALL_DISPOSITIFS, fetchAllDispositifs);
}

export default latestActionsSaga;
