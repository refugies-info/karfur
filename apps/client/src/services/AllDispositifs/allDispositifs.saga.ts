import { DispositifOrigin, type GetAllDispositifsResponse } from "@refugies-info/api-types";
import type { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { logger } from "~/logger";
import API from "~/utils/API";
import {
  finishLoading,
  LoadingStatusKey,
  startLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { setAllDispositifsActionsCreator } from "./allDispositifs.actions";

export function* fetchAllDispositifs(): SagaIterator {
  try {
    logger.info("[fetchAllDispositifs] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
    const data: GetAllDispositifsResponse[] = yield call(API.getAllDispositifs);
    // TODO: filter by origin RI for later
    // const filteredData = data.filter((d) => d.origin === DispositifOrigin.RI);
    // yield put(setAllDispositifsActionsCreator(filteredData));
    yield put(setAllDispositifsActionsCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
  } catch (e) {
    logger.error("[fetchAllDispositifs] saga", e);
    yield put(setAllDispositifsActionsCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
  }
}

export default function* allDispositifsSaga(): SagaIterator {
  yield takeLatest("FETCH_ALL_DISPOSITIFS", fetchAllDispositifs);
}
