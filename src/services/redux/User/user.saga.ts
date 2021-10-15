import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, select } from "redux-saga/effects";
import { logger } from "../../../logger";
import {
  saveSelectedLanguageActionCreator,
  setSelectedLanguageActionCreator,
  setHasUserSeenOnboardingActionCreator,
  setUserHasNewFavoritesActionCreator,
  setCurrentLanguageActionCreator,
  saveUserLocationActionCreator,
  saveUserFrenchLevelActionCreator,
  saveUserAgeActionCreator,
  setUserAgeActionCreator,
  setUserLocationActionCreator,
  setUserFrenchLevelActionCreator,
  removeUserAgeActionCreator,
  removeUserLocationActionCreator,
  removeUserFrenchLevelActionCreator,
  setUserFavoritesActionCreator,
  addUserFavoriteActionCreator,
  removeUserFavoriteActionCreator,
} from "./user.actions";
import {
  SAVE_SELECTED_LANGUAGE,
  SAVE_USER_HAS_SEEN_ONBOARDING,
  SAVE_USER_LOCATION,
  SAVE_USER_AGE,
  SAVE_USER_FRENCH_LEVEL,
  SAVE_USER_HAS_NEW_FAVORITES,
  GET_USER_INFOS,
  REMOVE_SELECTED_LANGUAGE,
  REMOVE_USER_LOCATION,
  REMOVE_USER_FRENCH_LEVEL,
  REMOVE_USER_AGE,
  REMOVE_USER_HAS_SEEN_ONBOARDING,
  REMOVE_USER_HAS_NEW_FAVORITES,
  ADD_USER_FAVORITE,
  REMOVE_USER_FAVORITE,
  REMOVE_USER_ALL_FAVORITES,
} from "./user.actionTypes";
import {
  saveItemInAsyncStorage,
  getItemInAsyncStorage,
  deleteItemInAsyncStorage,
} from "./functions";
import { fetchContentsActionCreator } from "../Contents/contents.actions";
import { hasUserSeenOnboardingSelector, userFavorites } from "./user.selectors";
import { logEventInFirebase } from "../../../utils/logEvent";
import { FirebaseEvent } from "../../../utils/eventsUsedInFirebase";

export function* saveSelectedLanguage(
  action: ReturnType<typeof saveSelectedLanguageActionCreator>
): SagaIterator {
  try {
    const { langue: i18nCode, shouldFetchContents } = action.payload;
    logger.info("[saveSelectedLanguage] saga", { langue: i18nCode });
    yield call(saveItemInAsyncStorage, "SELECTED_LANGUAGE", i18nCode);
    yield put(setSelectedLanguageActionCreator(i18nCode));
    yield put(setCurrentLanguageActionCreator(i18nCode));
    yield call(logEventInFirebase, FirebaseEvent.VALIDATE_LANGUAGE, {
      language: i18nCode,
    });
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
    const { city, dep, shouldFetchContents } = action.payload;
    logger.info("[saveUserLocation] saga", { city, dep });
    yield call(saveItemInAsyncStorage, "CITY", city);
    yield call(saveItemInAsyncStorage, "DEP", dep);
    yield put(setUserLocationActionCreator({ city, dep }));
    yield call(logEventInFirebase, FirebaseEvent.VALIDATE_LOCATION, {
      city: city.replace("-", "_"),
      dep: dep.replace("-", "_"),
    });

    if (shouldFetchContents) {
      yield put(fetchContentsActionCreator());
    }
  } catch (error) {
    logger.error("[saveUserLocation] saga error", { error: error.message });
    yield put(setUserLocationActionCreator({ city: null, dep: null }));
  }
}

export function* removeUserLocation(
  action: ReturnType<typeof removeUserLocationActionCreator>
): SagaIterator {
  try {
    const shouldFetchContents = action.payload;
    logger.info("[removeUserLocation] saga");
    yield call(deleteItemInAsyncStorage, "DEP");
    yield call(deleteItemInAsyncStorage, "CITY");
    yield put(setUserLocationActionCreator({ city: null, dep: null }));
    if (shouldFetchContents) {
      yield put(fetchContentsActionCreator());
    }
  } catch (error) {
    logger.error("Error while removing location", { error: error.message });
  }
}

export function* saveUserFrenchLevel(
  action: ReturnType<typeof saveUserFrenchLevelActionCreator>
): SagaIterator {
  try {
    const { frenchLevel, shouldFetchContents } = action.payload;
    logger.info("[saveUserFrenchLevel] saga", { frenchLevel });
    yield call(saveItemInAsyncStorage, "FRENCH_LEVEL", frenchLevel);
    yield put(setUserFrenchLevelActionCreator(frenchLevel));
    yield call(logEventInFirebase, FirebaseEvent.VALIDATE_FRENCH_LEVEL, {
      level: frenchLevel,
    });
    if (shouldFetchContents) {
      yield put(fetchContentsActionCreator());
    }
  } catch (error) {
    logger.error("[saveUserFrenchLevel] saga error", { error: error.message });
    yield put(setUserFrenchLevelActionCreator(null));
  }
}

export function* removeUserFrenchLevel(
  action: ReturnType<typeof removeUserFrenchLevelActionCreator>
): SagaIterator {
  try {
    const shouldFetchContents = action.payload;
    logger.info("[removeUserFrenchLevel] saga");
    yield call(deleteItemInAsyncStorage, "FRENCH_LEVEL");
    yield put(setUserFrenchLevelActionCreator(null));
    if (shouldFetchContents) {
      yield put(fetchContentsActionCreator());
    }
  } catch (error) {
    logger.error("Error while removing french level", { error: error.message });
  }
}

export function* saveUserAge(
  action: ReturnType<typeof saveUserAgeActionCreator>
): SagaIterator {
  try {
    const { age, shouldFetchContents } = action.payload;
    logger.info("[saveUserAge] saga", { age });
    yield call(saveItemInAsyncStorage, "AGE", age);
    yield put(setUserAgeActionCreator(age));
    yield call(logEventInFirebase, FirebaseEvent.VALIDATE_AGE, {
      age,
    });
    if (shouldFetchContents) {
      yield put(fetchContentsActionCreator());
    }
  } catch (error) {
    logger.error("[saveUserAge] saga error", { error: error.message });
    yield put(setUserAgeActionCreator(null));
  }
}

export function* removeUserAge(
  action: ReturnType<typeof removeUserAgeActionCreator>
): SagaIterator {
  try {
    const shouldFetchContents = action.payload;
    logger.info("[removeUserAge] saga");
    yield call(deleteItemInAsyncStorage, "AGE");
    yield put(setUserAgeActionCreator(null));
    if (shouldFetchContents) {
      yield put(fetchContentsActionCreator());
    }
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

export function* saveUserHasNewFavorites(): SagaIterator {
  try {
    logger.info("[saveUserHasNewFavorites] saga");
    yield call(saveItemInAsyncStorage, "HAS_USER_NEW_FAVORITES", "TRUE");
    yield put(setUserHasNewFavoritesActionCreator(true));
  } catch (error) {
    logger.error("Error while saving user has new favorites", {
      error: error.message,
    });
  }
}

export function* removeUserHasNewFavorites(): SagaIterator {
  try {
    logger.info("[removeUserHasNewFavorites] saga");
    yield call(deleteItemInAsyncStorage, "HAS_USER_NEW_FAVORITES");
    yield put(setUserHasNewFavoritesActionCreator(false));
  } catch (error) {
    logger.error("Error while removing has user new favorites", {
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
    try {
      const favorites = yield call(getItemInAsyncStorage, "FAVORITES");
      if (favorites) {
        yield put(setUserFavoritesActionCreator(JSON.parse(favorites || "[]")));
      }
    } catch (error) {
      logger.error("Error while getting user favorites", {
        error: error.message,
      });
    }
  } catch (error) {
    logger.error("Error while getting user infos", {
      error: error.message,
    });
  }
}

export function* addUserFavorite(
  action: ReturnType<typeof addUserFavoriteActionCreator>
): SagaIterator {
  try {
    logger.info("[addFavorite] saga", action.payload);
    const favorites = yield select(userFavorites);
    const newFavorites = [...(favorites || []), action.payload];
    yield call(
      saveItemInAsyncStorage,
      "FAVORITES",
      JSON.stringify(newFavorites)
    );
    yield put(setUserFavoritesActionCreator(newFavorites));
  } catch (error) {
    logger.error("Error while adding favorite", { error: error.message });
  }
}

export function* removeUserFavorite(
  action: ReturnType<typeof removeUserFavoriteActionCreator>
): SagaIterator {
  try {
    logger.info("[removeFavorite] saga", action.payload);
    const favorites = yield select(userFavorites);
    const newFavorites = (favorites || []).filter(
      (f: string) => f !== action.payload
    );
    yield call(
      saveItemInAsyncStorage,
      "FAVORITES",
      JSON.stringify(newFavorites)
    );
    yield put(setUserFavoritesActionCreator(newFavorites));
  } catch (error) {
    logger.error("Error while removing favorite", { error: error.message });
  }
}

export function* removeUserAllFavorites(): SagaIterator {
  try {
    logger.info("[removeAllFavorites] saga");
    yield call(saveItemInAsyncStorage, "FAVORITES", JSON.stringify([]));
    yield put(setUserFavoritesActionCreator([]));
  } catch (error) {
    logger.error("Error while removing favorites", { error: error.message });
  }
}

function* latestActionsSaga() {
  yield takeLatest(SAVE_SELECTED_LANGUAGE, saveSelectedLanguage);
  yield takeLatest(SAVE_USER_HAS_SEEN_ONBOARDING, saveHasUserSeenOnboarding);
  yield takeLatest(SAVE_USER_HAS_NEW_FAVORITES, saveUserHasNewFavorites);
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
  yield takeLatest(REMOVE_USER_HAS_NEW_FAVORITES, removeUserHasNewFavorites);
  yield takeLatest(ADD_USER_FAVORITE, addUserFavorite);
  yield takeLatest(REMOVE_USER_FAVORITE, removeUserFavorite);
  yield takeLatest(REMOVE_USER_ALL_FAVORITES, removeUserAllFavorites);
}

export default latestActionsSaga;
