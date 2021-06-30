import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, select } from "redux-saga/effects";
import { logger } from "../../../logger";
import {
  saveSelectedLanguageActionCreator,
  setSelectedLanguageActionCreator,
  setHasUserSeenOnboardingActionCreator,
  setCurrentLanguageActionCreator,
  saveUserLocationActionCreator,
  saveUserFrenchLevelActionCreator,
  saveUserAgeActionCreator,
  setUserAgeActionCreator,
  setUserLocationActionCreator,
  setUserFrenchLevelActionCreator,
} from "./user.actions";
import {
  SAVE_SELECTED_LANGUAGE,
  SAVE_USER_HAS_SEEN_ONBOARDING,
  SAVE_USER_LOCATION,
  SAVE_USER_AGE,
  SAVE_USER_FRENCH_LEVEL,
  GET_USER_INFOS,
  REMOVE_SELECTED_LANGUAGE,
  REMOVE_USER_LOCATION,
  REMOVE_USER_FRENCH_LEVEL,
  REMOVE_USER_AGE,
  REMOVE_USER_HAS_SEEN_ONBOARDING,
} from "./user.actionTypes";
import {
  saveItemInAsyncStorage,
  getItemInAsyncStorage,
  deleteItemInAsyncStorage,
} from "./functions";
import { fetchContentsActionCreator } from "../Contents/contents.actions";
import { hasUserSeenOnboardingSelector } from "./user.selectors";

export function* saveSelectedLanguage(
  action: ReturnType<typeof saveSelectedLanguageActionCreator>
): SagaIterator {
  try {
    const { langue: i18nCode, shouldFetchContents } = action.payload;
    logger.info("[saveSelectedLanguage] saga", { langue: i18nCode });
    yield call(saveItemInAsyncStorage, "SELECTED_LANGUAGE", i18nCode);
    yield put(setSelectedLanguageActionCreator(i18nCode));
    yield put(setCurrentLanguageActionCreator(i18nCode));
    if (shouldFetchContents) {
      yield put(fetchContentsActionCreator());
    }
  } catch (error) {
    logger.error("Error while saving langue", { error: error.message });
    yield put(setSelectedLanguageActionCreator("fr"));
    yield put(setCurrentLanguageActionCreator("fr"));
  }
}

export function* removeSelectedLanguage(): SagaIterator {
  try {
    logger.info("[removeSelectedLanguage] saga");
    yield call(deleteItemInAsyncStorage, "SELECTED_LANGUAGE");
    yield put(setSelectedLanguageActionCreator(null));
    yield put(setCurrentLanguageActionCreator(null));
  } catch (error) {
    logger.error("Error while removing langue", { error: error.message });
    yield put(setSelectedLanguageActionCreator("fr"));
    yield put(setCurrentLanguageActionCreator("fr"));
  }
}

export function* saveUserLocation(
  action: ReturnType<typeof saveUserLocationActionCreator>
): SagaIterator {
  try {
    const { city, dep } = action.payload;
    logger.info("[saveUserLocation] saga", { city, dep });
    yield call(saveItemInAsyncStorage, "CITY", city);
    yield call(saveItemInAsyncStorage, "DEP", dep);

    yield put(setUserLocationActionCreator({ city, dep }));
  } catch (error) {
    logger.error("[saveUserLocation] saga error", { error: error.message });
    yield put(setUserLocationActionCreator({ city: null, dep: null }));
  }
}

export function* removeUserLocation(): SagaIterator {
  try {
    logger.info("[removeUserLocation] saga");
    yield call(deleteItemInAsyncStorage, "DEP");
    yield call(deleteItemInAsyncStorage, "CITY");
    yield put(setUserLocationActionCreator({ city: null, dep: null }));
  } catch (error) {
    logger.error("Error while removing location", { error: error.message });
  }
}

export function* saveUserFrenchLevel(
  action: ReturnType<typeof saveUserFrenchLevelActionCreator>
): SagaIterator {
  try {
    const frenchLevel = action.payload;
    logger.info("[saveUserFrenchLevel] saga", { frenchLevel });
    yield call(saveItemInAsyncStorage, "FRENCH_LEVEL", frenchLevel);
    yield put(setUserFrenchLevelActionCreator(frenchLevel));
  } catch (error) {
    logger.error("[saveUserFrenchLevel] saga error", { error: error.message });
    yield put(setUserFrenchLevelActionCreator(null));
  }
}

export function* removeUserFrenchLevel(): SagaIterator {
  try {
    logger.info("[removeUserFrenchLevel] saga");
    yield call(deleteItemInAsyncStorage, "FRENCH_LEVEL");
    yield put(setUserFrenchLevelActionCreator(null));
  } catch (error) {
    logger.error("Error while removing french level", { error: error.message });
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

export function* removeUserAge(): SagaIterator {
  try {
    logger.info("[removeUserAge] saga");
    yield call(deleteItemInAsyncStorage, "AGE");
    yield put(setUserAgeActionCreator(null));
  } catch (error) {
    logger.error("Error while removing age", { error: error.message });
  }
}

export function* saveHasUserSeenOnboarding(): SagaIterator {
  try {
    logger.info("[saveHasUserSeenOnboarding] saga");
    yield call(saveItemInAsyncStorage, "HAS_USER_SEEN_ONBOARDING", "TRUE");
    yield put(setHasUserSeenOnboardingActionCreator(true));
  } catch (error) {
    logger.error("Error while saving user has seen onboarding", {
      error: error.message,
    });
    yield put(setHasUserSeenOnboardingActionCreator(true));
  }
}

export function* removeHasUserSeenOnboarding(): SagaIterator {
  try {
    logger.info("[removeHasUserSeenOnboarding] saga");
    yield call(deleteItemInAsyncStorage, "HAS_USER_SEEN_ONBOARDING");
    yield put(setHasUserSeenOnboardingActionCreator(false));
  } catch (error) {
    logger.error("Error while removing has user seen onboarding", {
      error: error.message,
    });
  }
}

export function* getUserInfos(): SagaIterator {
  try {
    logger.info("[getUserInfos] saga");
    try {
      const selectedLanguage = yield call(
        getItemInAsyncStorage,
        "SELECTED_LANGUAGE"
      );
      if (selectedLanguage) {
        yield put(setSelectedLanguageActionCreator(selectedLanguage));
        yield put(setCurrentLanguageActionCreator(selectedLanguage));
      }
    } catch (error) {
      logger.error("Error while getting language", {
        error: error.message,
      });
    }
    try {
      const city = yield call(getItemInAsyncStorage, "CITY");
      const dep = yield call(getItemInAsyncStorage, "DEP");
      if (city && dep) {
        yield put(setUserLocationActionCreator({ city, dep }));
      }
    } catch (error) {
      logger.error("Error while getting user location", {
        error: error.message,
      });
    }
    try {
      const age = yield call(getItemInAsyncStorage, "AGE");
      if (age) {
        yield put(setUserAgeActionCreator(age));
      }
    } catch (error) {
      logger.error("Error while getting user age", {
        error: error.message,
      });
    }
    try {
      const frenchLevel = yield call(getItemInAsyncStorage, "FRENCH_LEVEL");
      if (frenchLevel) {
        yield put(setUserFrenchLevelActionCreator(frenchLevel));
      }
    } catch (error) {
      logger.error("Error while getting user french level", {
        error: error.message,
      });
    }
    const hasUserSeenOnboarding = yield select(hasUserSeenOnboardingSelector);
    if (hasUserSeenOnboarding) {
      yield put(fetchContentsActionCreator());
    }
  } catch (error) {
    logger.error("Error while getting user infos", {
      error: error.message,
    });
  }
}

function* latestActionsSaga() {
  yield takeLatest(SAVE_SELECTED_LANGUAGE, saveSelectedLanguage);
  yield takeLatest(SAVE_USER_HAS_SEEN_ONBOARDING, saveHasUserSeenOnboarding);
  yield takeLatest(SAVE_USER_LOCATION, saveUserLocation);
  yield takeLatest(SAVE_USER_FRENCH_LEVEL, saveUserFrenchLevel);
  yield takeLatest(SAVE_USER_AGE, saveUserAge);
  yield takeLatest(GET_USER_INFOS, getUserInfos);
  yield takeLatest(REMOVE_SELECTED_LANGUAGE, removeSelectedLanguage);
  yield takeLatest(REMOVE_USER_LOCATION, removeUserLocation);
  yield takeLatest(REMOVE_USER_AGE, removeUserAge);
  yield takeLatest(REMOVE_USER_FRENCH_LEVEL, removeUserFrenchLevel);
  yield takeLatest(
    REMOVE_USER_HAS_SEEN_ONBOARDING,
    removeHasUserSeenOnboarding
  );
}

export default latestActionsSaga;
