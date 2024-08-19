import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import {
  startLoading,
  finishLoading,
  LoadingStatusKey,
} from "../LoadingStatus/loadingStatus.actions";
import { getLanguages } from "../../../utils/API";
import { logger } from "../../../logger";
import { setLanguagesActionCreator } from "./languages.actions";
import { FETCH_LANGUAGES } from "./languages.actionTypes";
import { GetLanguagesResponse } from "@refugies-info/api-types";

export function* fetchLanguages(): SagaIterator {
  try {
    logger.info("[fetchLanguages] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_LANGUAGES));
    const data: GetLanguagesResponse[] = yield call(getLanguages);

    yield put(setLanguagesActionCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_LANGUAGES));
  } catch (error: any) {
    logger.error("Error while fetching langues", { error: error.message });
    yield put(setLanguagesActionCreator([]));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_LANGUAGES, fetchLanguages);
}

export default latestActionsSaga;
