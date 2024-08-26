import { GetAllDispositifsResponse } from "@refugies-info/api-types";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { logger } from "../../logger";
import API from "../../utils/API";
import { LoadingStatusKey, finishLoading, startLoading } from "../LoadingStatus/loadingStatus.actions";
import { FETCH_ALL_DISPOSITIFS } from "./allDispositifs.actionTypes";
import { setAllDispositifsActionsCreator } from "./allDispositifs.actions";

export function* fetchAllDispositifs(): SagaIterator {
  try {
    logger.info("[fetchAllDispositifs saga]");
    yield put(startLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
    const data: GetAllDispositifsResponse[] = yield call(API.getAllDispositifs);
    yield put(setAllDispositifsActionsCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
  } catch (error) {
    logger.error("[fetchAllDispositifs saga] Error while fetching dispositifs", { error });
    yield put(setAllDispositifsActionsCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_ALL_DISPOSITIFS, fetchAllDispositifs);
}

export default latestActionsSaga;
