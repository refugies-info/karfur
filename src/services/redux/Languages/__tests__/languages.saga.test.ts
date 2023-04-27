import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, { fetchLanguages } from "../languages.saga";
import { setLanguagesActionCreator } from "../languages.actions";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { getLanguages } from "../../../../utils/API";

describe("[Saga] languages", () => {
  describe("pilot", () => {
    it("should trigger all the sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_LANGUAGES", fetchLanguages)
        .next()
        .isDone();
    });
  });

  describe("fetch languages saga", () => {
    it("should call function sand set data", () => {
      testSaga(fetchLanguages)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_LANGUAGES))
        .next()
        .call(getLanguages)
        .next([
          {
            _id: "6221e7f13f94e9fb90fab69f",
            langueFr: "Ukrainien",
            langueLoc: "Українська",
            langueCode: "ua",
            i18nCode: "uk",
            avancement: 1,
            avancementTrad: 0.978494623655914,
          },
          {
            _id: "5ce57c969aadae8734c7aedd",
            langueFr: "Français",
            langueLoc: "Français",
            langueCode: "fr",
            i18nCode: "fr",
            avancement: 1,
            avancementTrad: 0,
          },
        ])
        .put(
          setLanguagesActionCreator([
            {
              _id: "6221e7f13f94e9fb90fab69f",
              langueFr: "Ukrainien",
              langueLoc: "Українська",
              langueCode: "ua",
              i18nCode: "uk",
              avancement: 1,
              avancementTrad: 0.978494623655914,
            },
            {
              _id: "5ce57c969aadae8734c7aedd",
              langueFr: "Français",
              langueLoc: "Français",
              langueCode: "fr",
              i18nCode: "fr",
              avancement: 1,
              avancementTrad: 0,
            },
          ])
        )
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_LANGUAGES))
        .next()
        .isDone();
    });
  });
});
