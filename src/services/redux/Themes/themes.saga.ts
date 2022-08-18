import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import {
  startLoading,
  finishLoading,
  LoadingStatusKey,
} from "../LoadingStatus/loadingStatus.actions";
import { logger } from "../../../logger";
import { setThemesActionCreator } from "./themes.actions";
import { FETCH_THEMES } from "./themes.actionTypes";
import { getThemes } from "../../../utils/API";

export function* fetchThemes(): SagaIterator {
  try {
    logger.info("[fetchThemes] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_THEMES));
    const data = yield call(getThemes);
    if (data && data.data && data.data.data) {
      yield put(setThemesActionCreator(data.data.data));
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
