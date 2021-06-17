import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import { logger } from "../../../logger";
import {
  saveSelectedLanguageActionCreator,
  setSelectedLanguageActionCreator,
  setHasUserSeenOnboardingActionCreator,
  setCurrentLanguageActionCreator,
  saveUserCityActionCreator,
  saveUserFrenchLeveleActionCreator,
  saveUserAgeActionCreator,
  setUserAgeActionCreator,
  setUserCityActionCreator,
  setUserFrenchLeveleActionCreator,
} from "./user.actions";
import {
  SAVE_SELECTED_LANGUAGE,
  SAVE_USER_HAS_SEEN_ONBOARDING,
  SAVE_USER_CITY,
  SAVE_USER_AGE,
  SAVE_USER_FRENCH_LEVEL,
} from "./user.actionTypes";
import { saveItemInAsyncStorage } from "./functions";

export function* saveSelectedLanguage(
  action: ReturnType<typeof saveSelectedLanguageActionCreator>
): SagaIterator {
  try {
    const i18nCode = action.payload;
    logger.info("[saveSelectedLanguage] saga", { langue: i18nCode });
    yield call(saveItemInAsyncStorage, "SELECTED_LANGUAGE", i18nCode);
    yield put(setSelectedLanguageActionCreator(i18nCode));
    yield put(setCurrentLanguageActionCreator(i18nCode));
  } catch (error) {
    logger.error("Error while saving langue", { error: error.message });
    yield put(setSelectedLanguageActionCreator("fr"));
    yield put(setCurrentLanguageActionCreator("fr"));
  }
}

export function* saveUserCity(
  action: ReturnType<typeof saveUserCityActionCreator>
): SagaIterator {
  try {
    const city = action.payload;
    logger.info("[saveUserCity] saga", { city });
    yield call(saveItemInAsyncStorage, "CITY", city);
    yield put(setUserCityActionCreator(city));
  } catch (error) {
    logger.error("[saveUserCity] saga error", { error: error.message });
    yield put(setUserCityActionCreator(null));
  }
}

export function* saveUserFrenchLevel(
  action: ReturnType<typeof saveUserFrenchLeveleActionCreator>
): SagaIterator {
  try {
    const frenchLevel = action.payload;
    logger.info("[saveUserFrenchLevel] saga", { frenchLevel });
    yield call(saveItemInAsyncStorage, "FRENCH_LEVEL", frenchLevel);
    yield put(setUserFrenchLeveleActionCreator(frenchLevel));
  } catch (error) {
    logger.error("[saveUserFrenchLevel] saga error", { error: error.message });
    yield put(setUserFrenchLeveleActionCreator(null));
  }
}

export function* saveUserAge(
  action: ReturnType<typeof saveUserAgeActionCreator>
): SagaIterator {
  try {
    const age = action.payload;
    logger.info("[saveUserAge] saga", { age });
    yield call(saveItemInAsyncStorage, "AGE", age);
    yield put(setUserAgeActionCreator(age));
  } catch (error) {
    logger.error("[saveUserAge] saga error", { error: error.message });
    yield put(setUserAgeActionCreator(null));
  }
}

export function* saveHasUserSeenOnboarding(): SagaIterator {
  try {
    logger.info("[saveHasUserSeenOnboarding] saga");
    yield call(saveItemInAsyncStorage, "HAS_USER_SEEN_ONBOARDING", "TRUE");
    yield put(setHasUserSeenOnboardingActionCreator());
  } catch (error) {
    logger.error("Error while saving user has seen onboarding", {
      error: error.message,
    });
    yield put(setHasUserSeenOnboardingActionCreator());
  }
}

function* latestActionsSaga() {
  yield takeLatest(SAVE_SELECTED_LANGUAGE, saveSelectedLanguage);
  yield takeLatest(SAVE_USER_HAS_SEEN_ONBOARDING, saveHasUserSeenOnboarding);
  yield takeLatest(SAVE_USER_CITY, saveUserCity);
  yield takeLatest(SAVE_USER_FRENCH_LEVEL, saveUserFrenchLevel);
  yield takeLatest(SAVE_USER_AGE, saveUserAge);
}

export default latestActionsSaga;
