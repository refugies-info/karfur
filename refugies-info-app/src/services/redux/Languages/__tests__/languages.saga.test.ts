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
        .next({
          data: {
            data: [
              {
                _id: "id",
                langueFr: "langueFr",
                avancementTrad: 0.6,
                autre: "autre",
                i18nCode: "i18nCode",
              },
              {
                _id: "id1",
                langueFr: "langueFr1",
                avancementTrad: 0.6,
                autre: "autre1",
                i18nCode: "i18nCode1",
              },
            ],
          },
        })
        .put(
          setLanguagesActionCreator([
            {
              _id: "id",
              langueFr: "langueFr",
              avancementTrad: 0.6,
              i18nCode: "i18nCode",
            },
            {
              _id: "id1",
              langueFr: "langueFr1",
              avancementTrad: 0.6,
              i18nCode: "i18nCode1",
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
