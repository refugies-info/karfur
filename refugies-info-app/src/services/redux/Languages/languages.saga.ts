import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, all } from "redux-saga/effects";
import {
  startLoading,
  finishLoading,
  LoadingStatusKey,
} from "../LoadingStatus/loadingStatus.actions";
import { getLanguages } from "../../../utils/API";
import { logger } from "../../../logger";
import {
  setLanguagesActionCreator,
  saveSelectedLanguageActionCreator,
  setSelectedLanguageActionCreator,
} from "./languages.actions";
import {
  FETCH_LANGUAGES,
  SAVE_SELECTED_LANGUAGE,
} from "./languages.actionTypes";
import { saveSelectedLanguageInAsyncStorage } from "./functions";

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

export function* saveSelectedLanguage(
  action: ReturnType<typeof saveSelectedLanguageActionCreator>
): SagaIterator {
  try {
    const i18nCode = action.payload;
    logger.info("[saveSelectedLanguage] saga", i18nCode);
    yield call(saveSelectedLanguageInAsyncStorage, i18nCode);
    yield put(setSelectedLanguageActionCreator(i18nCode));
  } catch (error) {
    logger.error("Error while saving langue", { error: error.message });
    yield put(setSelectedLanguageActionCreator("fr"));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_LANGUAGES, fetchLanguages);
  yield takeLatest(SAVE_SELECTED_LANGUAGE, saveSelectedLanguage);
}

export default latestActionsSaga;
