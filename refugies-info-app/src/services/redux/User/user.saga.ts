import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import { logger } from "../../../logger";
import {
  saveSelectedLanguageActionCreator,
  setSelectedLanguageActionCreator,
} from "./user.actions";
import { SAVE_SELECTED_LANGUAGE } from "./user.actionTypes";
import { saveSelectedLanguageInAsyncStorage } from "./functions";

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
  yield takeLatest(SAVE_SELECTED_LANGUAGE, saveSelectedLanguage);
}

export default latestActionsSaga;
