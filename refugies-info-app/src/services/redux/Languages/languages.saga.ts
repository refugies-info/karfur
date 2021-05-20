import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, all } from "redux-saga/effects";
import {
  startLoading,
  finishLoading,
  LoadingStatusKey,
} from "../LoadingStatus/loadingStatus.actions";
import { getLanguages } from "../../../utils/API";
import { logger } from "../../../logger";
import { setLanguagesActionCreator } from "./languages.actions";
import { FETCH_LANGUAGES } from "./languages.actionTypes";

export function* fetchLanguages(): SagaIterator {
  try {
    logger.info("[fetchLanguages] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_LANGUAGES));
    const data = yield call(getLanguages);
    const formattedLanguages =
      data && data.data && data.data.data
        ? data.data.data.map((langue: any) => ({
            _id: langue._id,
            langueFr: langue.langueFr,
            avancementTrad: langue.avancementTrad,
            i18nCode: langue.i18nCode,
          }))
        : [];
    yield put(setLanguagesActionCreator(formattedLanguages));
    yield put(finishLoading(LoadingStatusKey.FETCH_LANGUAGES));
  } catch (error) {
    logger.error("Error while fetching langues", { error: error.message });
    yield put(setLanguagesActionCreator([]));
  }
}

function* latestActionsSaga() {
  yield all([takeLatest(FETCH_LANGUAGES, fetchLanguages)]);
}

export default latestActionsSaga;
