import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, {
  saveSelectedLanguage,
  saveHasUserSeenOnboarding,
  saveUserAge,
  saveUserLocation,
  saveUserFrenchLevel,
  getUserInfos,
  removeSelectedLanguage,
  removeUserLocation,
  removeUserAge,
  removeUserFrenchLevel,
  removeHasUserSeenOnboarding,
  addUserFavorite,
  removeUserFavorite,
  removeUserAllFavorites,
  saveUserHasNewFavorites,
  removeUserHasNewFavorites,
  saveUserLocalizedWarningHidden,
  removeUserLocalizedWarningHidden,
} from "../user.saga";
import {
  saveItemInAsyncStorage,
  getItemInAsyncStorage,
  deleteItemInAsyncStorage,
} from "../functions";
import {
  setSelectedLanguageActionCreator,
  setHasUserSeenOnboardingActionCreator,
  setCurrentLanguageActionCreator,
  setUserFrenchLevelActionCreator,
  setUserAgeActionCreator,
  setUserLocationActionCreator,
  setUserFavoritesActionCreator,
  setUserHasNewFavoritesActionCreator,
  setUserLocalizedWarningHiddenActionCreator,
} from "../user.actions";
import { fetchContentsActionCreator } from "../../Contents/contents.actions";
import { hasUserSeenOnboardingSelector } from "../user.selectors";
import { logEventInFirebase } from "../../../../utils/logEvent";
import { FirebaseEvent } from "../../../../utils/eventsUsedInFirebase";

describe("[Saga] user", () => {
  describe("pilot", () => {
    it("should trigger all the sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("SAVE_SELECTED_LANGUAGE", saveSelectedLanguage)
        .next()
        .takeLatest("SAVE_USER_HAS_SEEN_ONBOARDING", saveHasUserSeenOnboarding)
        .next()
        .takeLatest("SAVE_USER_HAS_NEW_FAVORITES", saveUserHasNewFavorites)
        .next()
        .takeLatest("SAVE_USER_LOCALIZED_WARNING_HIDDEN", saveUserLocalizedWarningHidden)
        .next()
        .takeLatest("SAVE_USER_LOCATION", saveUserLocation)
        .next()
        .takeLatest("SAVE_USER_FRENCH_LEVEL", saveUserFrenchLevel)
        .next()
        .takeLatest("SAVE_USER_AGE", saveUserAge)
        .next()
        .takeLatest("GET_USER_INFOS", getUserInfos)
        .next()
        .takeLatest("REMOVE_SELECTED_LANGUAGE", removeSelectedLanguage)
        .next()
        .takeLatest("REMOVE_USER_LOCATION", removeUserLocation)
        .next()
        .takeLatest("REMOVE_USER_AGE", removeUserAge)
        .next()
        .takeLatest("REMOVE_USER_FRENCH_LEVEL", removeUserFrenchLevel)
        .next()
        .takeLatest(
          "REMOVE_USER_HAS_SEEN_ONBOARDING",
          removeHasUserSeenOnboarding
        )
        .next()
        .takeLatest("REMOVE_USER_HAS_NEW_FAVORITES", removeUserHasNewFavorites)
        .next()
        .takeLatest("REMOVE_USER_LOCALIZED_WARNING_HIDDEN", removeUserLocalizedWarningHidden)
        .next()
        .takeLatest("ADD_USER_FAVORITE", addUserFavorite)
        .next()
        .takeLatest("REMOVE_USER_FAVORITE", removeUserFavorite)
        .next()
        .takeLatest("REMOVE_USER_ALL_FAVORITES", removeUserAllFavorites)
        .next()
        .isDone();
    });
  });

  describe("save selected language saga", () => {
    it("should call functions and set data", () => {
      testSaga(saveSelectedLanguage, {
        type: "SAVE_SELECTED_LANGUAGE",
        payload: { langue: "en", shouldFetchContents: false },
      })
        .next()
        .call(saveItemInAsyncStorage, "SELECTED_LANGUAGE", "en")
        .next()
        .put(setSelectedLanguageActionCreator("en"))
        .next()
        .put(setCurrentLanguageActionCreator("en"))
        .next()
        .call(logEventInFirebase, FirebaseEvent.VALIDATE_LANGUAGE, {
          language: "en",
        })
        .next()
        .isDone();
    });

    it("should call functions and set fr if saveItemInAsyncStorage throws", () => {
      testSaga(saveSelectedLanguage, {
        type: "SAVE_SELECTED_LANGUAGE",
        payload: { langue: "en", shouldFetchContents: false },
      })
        .next()
        .call(saveItemInAsyncStorage, "SELECTED_LANGUAGE", "en")
        .throw(new Error("error"))
        .put(setSelectedLanguageActionCreator("fr"))
        .next()
        .put(setCurrentLanguageActionCreator("fr"))
        .next()
        .isDone();
    });

    it("should call functions and set data and fetch contents when shouldFetchContents is true", () => {
      testSaga(saveSelectedLanguage, {
        type: "SAVE_SELECTED_LANGUAGE",
        payload: { langue: "en", shouldFetchContents: true },
      })
        .next()
        .call(saveItemInAsyncStorage, "SELECTED_LANGUAGE", "en")
        .next()
        .put(setSelectedLanguageActionCreator("en"))
        .next()
        .put(setCurrentLanguageActionCreator("en"))
        .next()
        .call(logEventInFirebase, FirebaseEvent.VALIDATE_LANGUAGE, {
          language: "en",
        })
        .next()
        .put(fetchContentsActionCreator())
        .next()
        .isDone();
    });
  });

  describe("save user has seen onboarding saga", () => {
    it("should call functions and set data", () => {
      testSaga(saveHasUserSeenOnboarding)
        .next()
        .call(saveItemInAsyncStorage, "HAS_USER_SEEN_ONBOARDING", "TRUE")
        .next()
        .put(setHasUserSeenOnboardingActionCreator(true))
        .next()
        .isDone();
    });

    it("should call functions and set fr if saveItemInAsyncStorage throws", () => {
      testSaga(saveHasUserSeenOnboarding)
        .next()
        .call(saveItemInAsyncStorage, "HAS_USER_SEEN_ONBOARDING", "TRUE")
        .throw(new Error("error"))
        .put(setHasUserSeenOnboardingActionCreator(true))
        .next()
        .isDone();
    });
  });

  describe("save french level saga", () => {
    it("should call functions and set data", () => {
      testSaga(saveUserFrenchLevel, {
        type: "SAVE_USER_FRENCH_LEVEL",
        payload: { frenchLevel: "level1", shouldFetchContents: false },
      })
        .next()
        .call(saveItemInAsyncStorage, "FRENCH_LEVEL", "level1")
        .next()
        .put(setUserFrenchLevelActionCreator("level1"))
        .next()
        .call(logEventInFirebase, FirebaseEvent.VALIDATE_FRENCH_LEVEL, {
          level: "level1",
        })
        .next()
        .isDone();
    });

    it("should call functions and set data", () => {
      testSaga(saveUserFrenchLevel, {
        type: "SAVE_USER_FRENCH_LEVEL",
        payload: { frenchLevel: "level1", shouldFetchContents: true },
      })
        .next()
        .call(saveItemInAsyncStorage, "FRENCH_LEVEL", "level1")
        .next()
        .put(setUserFrenchLevelActionCreator("level1"))
        .next()
        .call(logEventInFirebase, FirebaseEvent.VALIDATE_FRENCH_LEVEL, {
          level: "level1",
        })
        .next()
        .put(fetchContentsActionCreator())
        .next()
        .isDone();
    });

    it("should call functions and set null if saveItemInAsyncStorage throws", () => {
      testSaga(saveUserFrenchLevel, {
        type: "SAVE_USER_FRENCH_LEVEL",
        payload: { frenchLevel: "level1", shouldFetchContents: false },
      })
        .next()
        .call(saveItemInAsyncStorage, "FRENCH_LEVEL", "level1")
        .throw(new Error("error"))
        .put(setUserFrenchLevelActionCreator(null))
        .next()

        .isDone();
    });
  });

  describe("save age saga", () => {
    it("should call functions and set data when shouldFetchContents true", () => {
      testSaga(saveUserAge, {
        type: "SAVE_USER_AGE",
        payload: { age: "age", shouldFetchContents: true },
      })
        .next()
        .call(saveItemInAsyncStorage, "AGE", "age")
        .next()
        .put(setUserAgeActionCreator("age"))
        .next()
        .call(logEventInFirebase, FirebaseEvent.VALIDATE_AGE, {
          age: "age",
        })
        .next()
        .put(fetchContentsActionCreator())
        .next()
        .isDone();
    });

    it("should call functions and set data when shouldFetchContents false", () => {
      testSaga(saveUserAge, {
        type: "SAVE_USER_AGE",
        payload: { age: "age", shouldFetchContents: false },
      })
        .next()
        .call(saveItemInAsyncStorage, "AGE", "age")
        .next()
        .put(setUserAgeActionCreator("age"))
        .next()
        .call(logEventInFirebase, FirebaseEvent.VALIDATE_AGE, {
          age: "age",
        })
        .next()
        .isDone();
    });

    it("should call functions and set null if saveItemInAsyncStorage throws", () => {
      testSaga(saveUserAge, {
        type: "SAVE_USER_AGE",
        payload: { age: "age", shouldFetchContents: true },
      })
        .next()
        .call(saveItemInAsyncStorage, "AGE", "age")
        .throw(new Error("error"))
        .put(setUserAgeActionCreator(null))
        .next()

        .isDone();
    });
  });

  describe("save location saga", () => {
    it("should call functions and set data", () => {
      testSaga(saveUserLocation, {
        type: "SAVE_USER_LOCATION",
        payload: { city: "city", dep: "dep", shouldFetchContents: false },
      })
        .next()
        .call(saveItemInAsyncStorage, "CITY", "city")
        .next()
        .call(saveItemInAsyncStorage, "DEP", "dep")
        .next()
        .put(setUserLocationActionCreator({ city: "city", dep: "dep" }))
        .next()
        .call(logEventInFirebase, FirebaseEvent.VALIDATE_LOCATION, {
          city: "city",
          dep: "dep",
        })
        .next()
        .isDone();
    });

    it("should call functions and set data", () => {
      testSaga(saveUserLocation, {
        type: "SAVE_USER_LOCATION",
        payload: { city: "city", dep: "dep", shouldFetchContents: true },
      })
        .next()
        .call(saveItemInAsyncStorage, "CITY", "city")
        .next()
        .call(saveItemInAsyncStorage, "DEP", "dep")
        .next()
        .put(setUserLocationActionCreator({ city: "city", dep: "dep" }))
        .next()
        .call(logEventInFirebase, FirebaseEvent.VALIDATE_LOCATION, {
          city: "city",
          dep: "dep",
        })
        .next()
        .put(fetchContentsActionCreator())
        .next()
        .isDone();
    });

    it("should call functions and set null if saveItemInAsyncStorage throws", () => {
      testSaga(saveUserLocation, {
        type: "SAVE_USER_LOCATION",
        payload: { city: "city", dep: "dep", shouldFetchContents: false },
      })
        .next()
        .call(saveItemInAsyncStorage, "CITY", "city")
        .throw(new Error("error"))
        .put(setUserLocationActionCreator({ city: null, dep: null }))
        .next()
        .isDone();
    });
  });

  describe("get user infos saga", () => {
    it("should get item in async storage and do nothing if no data", () => {
      testSaga(getUserInfos)
        .next()
        .call(getItemInAsyncStorage, "SELECTED_LANGUAGE")
        .next(null)
        .call(getItemInAsyncStorage, "CITY")
        .next(null)
        .call(getItemInAsyncStorage, "DEP")
        .next(null)
        .call(getItemInAsyncStorage, "AGE")
        .next(null)
        .call(getItemInAsyncStorage, "FRENCH_LEVEL")
        .next(null)
        .select(hasUserSeenOnboardingSelector)
        .next(false)
        .call(getItemInAsyncStorage, "FAVORITES")
        .next(false)
        .call(getItemInAsyncStorage, "LOCALIZED_WARNING_HIDDEN")
        .next(null)
        .isDone();
    });

    it("should get item in async storage and set data in store", () => {
      testSaga(getUserInfos)
        .next()
        .call(getItemInAsyncStorage, "SELECTED_LANGUAGE")
        .next("fr")
        .put(setSelectedLanguageActionCreator("fr"))
        .next()
        .put(setCurrentLanguageActionCreator("fr"))
        .next()
        .call(getItemInAsyncStorage, "CITY")
        .next("city")
        .call(getItemInAsyncStorage, "DEP")
        .next("dep")
        .put(setUserLocationActionCreator({ city: "city", dep: "dep" }))
        .next()
        .call(getItemInAsyncStorage, "AGE")
        .next("age")
        .put(setUserAgeActionCreator("age"))
        .next()
        .call(getItemInAsyncStorage, "FRENCH_LEVEL")
        .next("frenchLevel")
        .put(setUserFrenchLevelActionCreator("frenchLevel"))
        .next()
        .select(hasUserSeenOnboardingSelector)
        .next(true)
        .put(fetchContentsActionCreator())
        .next()
        .call(getItemInAsyncStorage, "FAVORITES")
        // eslint-disable-next-line quotes
        .next('["5e7b292c1eaf4d0051d9efe2"]')
        .put(setUserFavoritesActionCreator(["5e7b292c1eaf4d0051d9efe2"]))
        .next()
        .call(getItemInAsyncStorage, "LOCALIZED_WARNING_HIDDEN")
        .next("")
        .isDone();
    });

    it("should get item in async storage and continue if it throws", () => {
      testSaga(getUserInfos)
        .next()
        .call(getItemInAsyncStorage, "SELECTED_LANGUAGE")
        .throw(new Error("error"))
        .call(getItemInAsyncStorage, "CITY")
        .throw(new Error("error"))
        .call(getItemInAsyncStorage, "AGE")
        .throw(new Error("error"))
        .call(getItemInAsyncStorage, "FRENCH_LEVEL")
        .throw(new Error("error"))
        .select(hasUserSeenOnboardingSelector)
        .next(false)
        .call(getItemInAsyncStorage, "FAVORITES")
        .throw(new Error("error"))
        .call(getItemInAsyncStorage, "LOCALIZED_WARNING_HIDDEN")
        .throw(new Error("error"))
        .isDone();
    });
  });

  describe("remove selected language saga", () => {
    it("should call functions and set data", () => {
      testSaga(removeSelectedLanguage)
        .next()
        .call(deleteItemInAsyncStorage, "SELECTED_LANGUAGE")
        .next()
        .put(setSelectedLanguageActionCreator(null))
        .next()
        .put(setCurrentLanguageActionCreator(null))
        .next()
        .isDone();
    });

    it("should call functions and set fr if deleteItemInAsyncStorage throws", () => {
      testSaga(removeSelectedLanguage)
        .next()
        .call(deleteItemInAsyncStorage, "SELECTED_LANGUAGE")
        .throw(new Error("error"))
        .put(setSelectedLanguageActionCreator("fr"))
        .next()
        .put(setCurrentLanguageActionCreator("fr"))
        .next()
        .isDone();
    });
  });

  describe("remove user location saga", () => {
    it("should call functions and set data", () => {
      testSaga(removeUserLocation, {
        type: "REMOVE_USER_LOCATION",
        payload: false,
      })
        .next()
        .call(deleteItemInAsyncStorage, "DEP")
        .next()
        .call(deleteItemInAsyncStorage, "CITY")
        .next()
        .put(setUserLocationActionCreator({ city: null, dep: null }))
        .next()
        .isDone();
    });

    it("should call functions and set data", () => {
      testSaga(removeUserLocation, {
        type: "REMOVE_USER_LOCATION",
        payload: true,
      })
        .next()
        .call(deleteItemInAsyncStorage, "DEP")
        .next()
        .call(deleteItemInAsyncStorage, "CITY")
        .next()
        .put(setUserLocationActionCreator({ city: null, dep: null }))
        .next()
        .put(fetchContentsActionCreator())
        .next()
        .isDone();
    });

    it("should call functions and deleteItemInAsyncStorage throws", () => {
      testSaga(removeUserLocation, {
        type: "REMOVE_USER_LOCATION",
        payload: false,
      })
        .next()
        .call(deleteItemInAsyncStorage, "DEP")
        .throw(new Error("error"))
        .isDone();
    });
  });

  describe("remove user french level saga", () => {
    it("should call functions and set data", () => {
      testSaga(removeUserFrenchLevel, {
        type: "REMOVE_USER_FRENCH_LEVEL",
        payload: false,
      })
        .next()
        .call(deleteItemInAsyncStorage, "FRENCH_LEVEL")
        .next()
        .put(setUserFrenchLevelActionCreator(null))
        .next()
        .isDone();
    });

    it("should call functions and set data", () => {
      testSaga(removeUserFrenchLevel, {
        type: "REMOVE_USER_FRENCH_LEVEL",
        payload: true,
      })
        .next()
        .call(deleteItemInAsyncStorage, "FRENCH_LEVEL")
        .next()
        .put(setUserFrenchLevelActionCreator(null))
        .next()
        .put(fetchContentsActionCreator())
        .next()
        .isDone();
    });

    it("should call functions and deleteItemInAsyncStorage throws", () => {
      testSaga(removeUserFrenchLevel, {
        type: "REMOVE_USER_FRENCH_LEVEL",
        payload: false,
      })
        .next()
        .call(deleteItemInAsyncStorage, "FRENCH_LEVEL")
        .throw(new Error("error"))
        .isDone();
    });
  });

  describe("remove user age saga", () => {
    it("should call functions and set data", () => {
      testSaga(removeUserAge, { type: "REMOVE_USER_AGE", payload: false })
        .next()
        .call(deleteItemInAsyncStorage, "AGE")
        .next()
        .put(setUserAgeActionCreator(null))
        .next()
        .isDone();
    });

    it("should call functions and set data", () => {
      testSaga(removeUserAge, { type: "REMOVE_USER_AGE", payload: true })
        .next()
        .call(deleteItemInAsyncStorage, "AGE")
        .next()
        .put(setUserAgeActionCreator(null))
        .next()
        .put(fetchContentsActionCreator())
        .next()
        .isDone();
    });

    it("should call functions and deleteItemInAsyncStorage throws", () => {
      testSaga(removeUserAge, { type: "REMOVE_USER_AGE", payload: false })
        .next()
        .call(deleteItemInAsyncStorage, "AGE")
        .throw(new Error("error"))
        .isDone();
    });
  });

  describe("remove user has seen onboarding saga", () => {
    it("should call functions and set data", () => {
      testSaga(removeHasUserSeenOnboarding)
        .next()
        .call(deleteItemInAsyncStorage, "HAS_USER_SEEN_ONBOARDING")
        .next()
        .put(setHasUserSeenOnboardingActionCreator(false))
        .next()
        .isDone();
    });

    it("should call functions and deleteItemInAsyncStorage throws", () => {
      testSaga(removeHasUserSeenOnboarding)
        .next()
        .call(deleteItemInAsyncStorage, "HAS_USER_SEEN_ONBOARDING")
        .throw(new Error("error"))
        .isDone();
    });
  });

  describe("handle has new favorite async storage", () => {
    it("should call functions and set token in localStorage", () => {
      testSaga(saveUserHasNewFavorites)
        .next()
        .call(saveItemInAsyncStorage, "HAS_USER_NEW_FAVORITES", "TRUE")
        .next()
        .put(setUserHasNewFavoritesActionCreator(true))
        .next()
        .isDone();
    });

    it("should call functions and remove token in localStorage", () => {
      testSaga(removeUserHasNewFavorites)
        .next()
        .call(deleteItemInAsyncStorage, "HAS_USER_NEW_FAVORITES")
        .next()
        .put(setUserHasNewFavoritesActionCreator(false))
        .next()
        .isDone();
    });
  });

  describe("handle localized warning hidden async storage", () => {
    it("should call functions and set token in localStorage", () => {
      testSaga(saveUserLocalizedWarningHidden)
        .next()
        .call(saveItemInAsyncStorage, "LOCALIZED_WARNING_HIDDEN", "TRUE")
        .next()
        .put(setUserLocalizedWarningHiddenActionCreator(true))
        .next()
        .isDone();
    });

    it("should call functions and remove token in localStorage", () => {
      testSaga(removeUserLocalizedWarningHidden)
        .next()
        .call(deleteItemInAsyncStorage, "LOCALIZED_WARNING_HIDDEN")
        .next()
        .put(setUserLocalizedWarningHiddenActionCreator(false))
        .next()
        .isDone();
    });
  });
});
