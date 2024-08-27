import { GetThemeResponse } from "@refugies-info/api-types";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { logger } from "~/logger";
import { getThemes } from "~/utils/API";
import { finishLoading, LoadingStatusKey, startLoading } from "../LoadingStatus/loadingStatus.actions";
import { setThemesActionCreator } from "./themes.actions";
import { FETCH_THEMES } from "./themes.actionTypes";

export function* fetchThemes(): SagaIterator {
  try {
    logger.info("[fetchThemes] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_THEMES));
    const data: GetThemeResponse[] = yield call(getThemes);
    if (data) {
      yield put(setThemesActionCreator(data));
    }
    yield put(finishLoading(LoadingStatusKey.FETCH_THEMES));
  } catch (error: any) {
    logger.error("Error while fetching themes", { error: error.message });
    yield put(setThemesActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_THEMES));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_THEMES, fetchThemes);
}

export default latestActionsSaga;
