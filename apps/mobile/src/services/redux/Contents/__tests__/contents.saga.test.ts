import { ContentType } from "@refugies-info/api-types";
import { testSaga } from "redux-saga-test-plan";
import { mockedThemesData } from "../../../../jest/__fixtures__/themes";
import { getContentsForApp, getNbContents } from "../../../../utils/API";
import { setGroupedContentsActionCreator } from "../../ContentsGroupedByNeeds/contentsGroupedByNeeds.actions";
import { LoadingStatusKey, finishLoading, startLoading } from "../../LoadingStatus/loadingStatus.actions";
import {
  selectedI18nCodeSelector,
  userAgeSelector,
  userFrenchLevelSelector,
  userLocationSelector,
} from "../../User/user.selectors";
import { setContentsActionCreator, setNbContentsActionCreator } from "../contents.actions";
import latestActionsSaga, { fetchContents } from "../contents.saga";
import { groupResultsByNeed } from "../functions";
import util from "util"

const theme = mockedThemesData[0];

describe("[Saga] contents", () => {
  util.inspect.defaultOptions.depth = null;

  describe("pilot", () => {
    it("should trigger all the sagas", () => {
      testSaga(latestActionsSaga).next().takeLatest("FETCH_CONTENTS", fetchContents).next().isDone();
    });
  });

  describe("fetch contents saga", () => {
    it("should not call function if no selected language", () => {
      testSaga(fetchContents)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_CONTENTS))
        .next()
        .select(selectedI18nCodeSelector)
        .next(null)
        .select(userAgeSelector)
        .next(null)
        .select(userLocationSelector)
        .next({ department: null })
        .select(userFrenchLevelSelector)
        .next(null)
        .put(
          setNbContentsActionCreator({
            nbGlobalContent: null,
            nbLocalizedContent: null,
          }),
        )
        .next(null)
        .put(finishLoading(LoadingStatusKey.FETCH_CONTENTS))
        .next()
        .isDone();
    });

    it.skip("should call function if selected language fr", () => {
      testSaga(fetchContents)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_CONTENTS))
        .next()
        .select(selectedI18nCodeSelector)
        .next("fr")
        .select(userAgeSelector)
        .next("age")
        .select(userLocationSelector)
        .next({
          locale: "fr",
          age: "age",
          county: "dep",
          frenchLevel: "frenchLevel",
          strictLocation: true,
        })
        .select(userFrenchLevelSelector)
        .next("frenchLevel")
        .call(getContentsForApp, {
          locale: "fr",
          age: "age",
          county: undefined,
          frenchLevel: "frenchLevel",
        })
        .next({
          dataFr: [
            {
              _id: "idFr",
              titreInformatif: "titre",
              theme: theme,
              secondaryThemes: [],
              typeContenu: "dispositif",
              nbVues: 1,
              sponsorUrl: null,
              avancement: 1,
            },
            {
              _id: "id1Fr",
              titreInformatif: "titre",
              theme: theme,
              secondaryThemes: [],
              typeContenu: "dispositif",
              nbVues: 1,
              sponsorUrl: null,
              avancement: 1,
            },
          ],
        })
        .put(
          setContentsActionCreator({
            langue: "fr",
            contents: [
              {
                _id: "idFr",
                locale: "fr",
                nbVues: 1,
                nbVuesMobile: 1,
                needs: [],
                secondaryThemes: [],
                sponsorUrl: "sponsorUrl",
                theme: theme,
                titreInformatif: "titre",
                titreMarque: "titreMarque",
                typeContenu: ContentType.DISPOSITIF,
              },
              {
                _id: "id1Fr",
                locale: "fr",
                nbVues: 1,
                nbVuesMobile: 1,
                needs: [],
                secondaryThemes: [],
                sponsorUrl: "sponsorUrl",
                theme: theme,
                titreInformatif: "titre",
                titreMarque: "titreMarque",
                typeContenu: ContentType.DISPOSITIF,
              },
            ],
          }),
        )
        .next()
        .call(groupResultsByNeed, [
          {
            _id: "idFr",
            titreInformatif: "titre",
            theme: theme,
            secondaryThemes: [],
            typeContenu: "dispositif",
            nbVues: 1,
            sponsorUrl: null,
            avancement: 1,
          },
          {
            _id: "id1Fr",
            titreInformatif: "titre",
            theme: theme,
            secondaryThemes: [],
            typeContenu: "dispositif",
            nbVues: 1,
            sponsorUrl: null,
            avancement: 1,
          },
        ])
        .next({ idFr: [], id1Fr: [] })
        .put(setGroupedContentsActionCreator({ idFr: [], id1Fr: [] }))
        .next()
        .call(getNbContents, { county: "dep" })
        .next({
          nbGlobalContent: 42,
          nbLocalizedContent: 42,
        })
        .put(
          setNbContentsActionCreator({
            nbGlobalContent: 42,
            nbLocalizedContent: 42,
          }),
        )
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_CONTENTS))
        .next()
        .isDone();
    });

    it("should not call function if selected language ar", () => {
      testSaga(fetchContents)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_CONTENTS))
        .next()
        .select(selectedI18nCodeSelector)
        .next("ar")
        .select(userAgeSelector)
        .next(null)
        .select(userLocationSelector)
        .next({ department: null })
        .select(userFrenchLevelSelector)
        .next(null)
        .call(getContentsForApp, {
          locale: "ar",
          age: null,
          county: null,
          frenchLevel: null,
        })
        .next({
          data: [
            {
              _id: "id_ar",
              locale: "ar",
              titreInformatif: "titre",
              titreMarque: "titreMarque",
              theme: theme,
              needs: [],
              secondaryThemes: [],
              typeContenu: "dispositif",
              nbVues: 1,
              nbVuesMobile: 1,
              sponsorUrl: "sponsorUrl",
            },
            {
              _id: "id1_ar",
              locale: "ar",
              titreInformatif: "titre",
              titreMarque: "titreMarque",
              theme: theme,
              needs: [],
              secondaryThemes: [],
              typeContenu: "dispositif",
              nbVues: 1,
              nbVuesMobile: 1,
              sponsorUrl: "sponsorUrl",
            },
          ],
          dataFr: [
            {
              _id: "id_fr",
              locale: "fr",
              titreInformatif: "titre",
              titreMarque: "titreMarque",
              theme: theme,
              needs: [],
              secondaryThemes: [],
              typeContenu: "dispositif",
              nbVues: 1,
              nbVuesMobile: 1,
              sponsorUrl: "sponsorUrl",
            },
            {
              _id: "id1_fr",
              locale: "fr",
              titreInformatif: "titre",
              titreMarque: "titreMarque",
              theme: theme,
              needs: [],
              secondaryThemes: [],
              typeContenu: "dispositif",
              nbVues: 1,
              nbVuesMobile: 1,
              sponsorUrl: "sponsorUrl",
            },
          ],
        })
        .put(
          setContentsActionCreator({
            langue: "ar",
            contents: [
              {
                _id: "id_ar",
                locale: "ar",
                nbVues: 1,
                nbVuesMobile: 1,
                needs: [],
                secondaryThemes: [],
                sponsorUrl: "sponsorUrl",
                theme: theme,
                titreInformatif: "titre",
                titreMarque: "titreMarque",
                typeContenu: ContentType.DISPOSITIF,
              },
              {
                _id: "id1_ar",
                locale: "ar",
                nbVues: 1,
                nbVuesMobile: 1,
                needs: [],
                secondaryThemes: [],
                sponsorUrl: "sponsorUrl",
                theme: theme,
                titreInformatif: "titre",
                titreMarque: "titreMarque",
                typeContenu: ContentType.DISPOSITIF,
              },
            ],
          }),
        )
        .next()
        .put(
          setContentsActionCreator({
            langue: "fr",
            contents: [
              {
                _id: "id_fr",
                locale: "fr",
                nbVues: 1,
                nbVuesMobile: 1,
                needs: [],
                secondaryThemes: [],
                sponsorUrl: "sponsorUrl",
                theme: theme,
                titreInformatif: "titre",
                titreMarque: "titreMarque",
                typeContenu: ContentType.DISPOSITIF,
              },
              {
                _id: "id1_fr",
                locale: "fr",
                nbVuesMobile: 1,
                needs: [],
                nbVues: 1,
                secondaryThemes: [],
                sponsorUrl: "sponsorUrl",
                theme: theme,
                titreInformatif: "titre",
                titreMarque: "titreMarque",
                typeContenu: ContentType.DISPOSITIF,
              },
            ],
          }),
        )
        .next()
        .call(groupResultsByNeed, [
          {
            _id: "id_fr",
            locale: "fr",
            titreInformatif: "titre",
            titreMarque: "titreMarque",
            theme: theme,
            needs: [],
            secondaryThemes: [],
            typeContenu: "dispositif",
            nbVues: 1,
            nbVuesMobile: 1,
            sponsorUrl: "sponsorUrl",
          },
          {
            _id: "id1_fr",
            locale: "fr",
            titreInformatif: "titre",
            titreMarque: "titreMarque",
            theme: theme,
            needs: [],
            secondaryThemes: [],
            typeContenu: "dispositif",
            nbVues: 1,
            nbVuesMobile: 1,
            sponsorUrl: "sponsorUrl",
          },
        ])
        .next({ idFr: [], id1Fr: [] })
        .put(setGroupedContentsActionCreator({ idFr: [], id1Fr: [] }))
        .next()
        .put(
          setNbContentsActionCreator({
            nbGlobalContent: null,
            nbLocalizedContent: null,
          }),
        )
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_CONTENTS))
        .next()
        .isDone();
    });
  });
});
