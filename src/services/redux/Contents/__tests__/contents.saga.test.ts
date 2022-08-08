import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, { fetchContents } from "../contents.saga";
import { setContentsActionCreator, setNbContentsActionCreator } from "../contents.actions";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { getContentsForApp, getNbContents } from "../../../../utils/API";
import {
  selectedI18nCodeSelector,
  userAgeSelector,
  userLocationSelector,
  userFrenchLevelSelector,
} from "../../User/user.selectors";
import { groupResultsByNeed } from "../functions";
import { setGroupedContentsActionCreator } from "../../ContentsGroupedByNeeds/contentsGroupedByNeeds.actions";

describe("[Saga] contents", () => {
  describe("pilot", () => {
    it("should trigger all the sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_CONTENTS", fetchContents)
        .next()
        .isDone();
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
        .put(setNbContentsActionCreator({
          nbGlobalContent: null, nbLocalizedContent: null
        }))
        .next(null)
        .put(finishLoading(LoadingStatusKey.FETCH_CONTENTS))
        .next()
        .isDone();
    });

    it("should call function if selected language fr", () => {
      testSaga(fetchContents)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_CONTENTS))
        .next()
        .select(selectedI18nCodeSelector)
        .next("fr")
        .select(userAgeSelector)
        .next("age")
        .select(userLocationSelector)
        .next({ department: "dep" })
        .select(userFrenchLevelSelector)
        .next("frenchLevel")
        .call(getContentsForApp, {
          locale: "fr",
          department: "dep",
          frenchLevel: "frenchLevel",
          age: "age",
        })
        .next({
          data: {
            dataFr: [
              {
                _id: "idFr",
                titreInformatif: "titre",
                tags: [],
                typeContenu: "dispositif",
                nbVues: 1,
                sponsorUrl: null,
                avancement: 1
              },
              {
                _id: "id1Fr",
                titreInformatif: "titre",
                tags: [],
                typeContenu: "dispositif",
                nbVues: 1,
                sponsorUrl: null,
                avancement: 1
              },
            ],
          },
        })
        .put(
          setContentsActionCreator({
            langue: "fr",
            contents: [
              {
                _id: "idFr",
                titreInformatif: "titre",
                tags: [],
                typeContenu: "dispositif",
                nbVues: 1,
                sponsorUrl: null,
                avancement: 1
              },
              {
                _id: "id1Fr",
                titreInformatif: "titre",
                tags: [],
                typeContenu: "dispositif",
                nbVues: 1,
                sponsorUrl: null,
                avancement: 1
              },
            ],
          })
        )
        .next()
        .call(groupResultsByNeed, [
          {
            _id: "idFr",
            titreInformatif: "titre",
            tags: [],
            typeContenu: "dispositif",
            nbVues: 1,
            sponsorUrl: null,
            avancement: 1
          },
          {
            _id: "id1Fr",
            titreInformatif: "titre",
            tags: [],
            typeContenu: "dispositif",
            nbVues: 1,
            sponsorUrl: null,
            avancement: 1
          },
        ])
        .next({ idFr: [], id1Fr: [] })
        .put(setGroupedContentsActionCreator({ idFr: [], id1Fr: [] }))
        .next()
        .call(getNbContents, {department: "dep"})
        .next()
        .put(setNbContentsActionCreator({
          nbGlobalContent: null, nbLocalizedContent: null
        }))
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
          department: null,
          frenchLevel: null,
        })
        .next({
          data: {
            data: [
              {
                _id: "id_ar",
                titreInformatif: "titre",
                tags: [],
                typeContenu: "dispositif",
                nbVues: 1,
                sponsorUrl: null,
                avancement: 1
              },
              {
                _id: "id1_ar",
                titreInformatif: "titre",
                tags: [],
                typeContenu: "dispositif",
                nbVues: 1,
                sponsorUrl: null,
                avancement: 1
              },
            ],
            dataFr: [
              {
                _id: "id_fr",
                titreInformatif: "titre",
                tags: [],
                typeContenu: "dispositif",
                nbVues: 1,
                sponsorUrl: null,
                avancement: 1
              },
              {
                _id: "id1_fr",
                titreInformatif: "titre",
                tags: [],
                typeContenu: "dispositif",
                nbVues: 1,
                sponsorUrl: null,
                avancement: 1
              },
            ],
          },
        })
        .put(
          setContentsActionCreator({
            langue: "ar",
            contents: [
              {
                _id: "id_ar",
                titreInformatif: "titre",
                tags: [],
                typeContenu: "dispositif",
                nbVues: 1,
                sponsorUrl: null,
                avancement: 1
              },
              {
                _id: "id1_ar",
                titreInformatif: "titre",
                tags: [],
                typeContenu: "dispositif",
                nbVues: 1,
                sponsorUrl: null,
                avancement: 1
              },
            ],
          })
        )
        .next()
        .put(
          setContentsActionCreator({
            langue: "fr",
            contents: [
              {
                _id: "id_fr",
                titreInformatif: "titre",
                tags: [],
                typeContenu: "dispositif",
                nbVues: 1,
                sponsorUrl: null,
                avancement: 1
              },
              {
                _id: "id1_fr",
                titreInformatif: "titre",
                tags: [],
                typeContenu: "dispositif",
                nbVues: 1,
                sponsorUrl: null,
                avancement: 1
              },
            ],
          })
        )
        .next()
        .call(groupResultsByNeed, [
          {
            _id: "id_fr",
            titreInformatif: "titre",
            tags: [],
            typeContenu: "dispositif",
            nbVues: 1,
            sponsorUrl: null,
            avancement: 1
          },
          {
            _id: "id1_fr",
            titreInformatif: "titre",
            tags: [],
            typeContenu: "dispositif",
            nbVues: 1,
            sponsorUrl: null,
            avancement: 1
          },
        ])
        .next({ idFr: [], id1Fr: [] })
        .put(setGroupedContentsActionCreator({ idFr: [], id1Fr: [] }))
        .next()
        .put(setNbContentsActionCreator({
          nbGlobalContent: null, nbLocalizedContent: null
        }))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_CONTENTS))
        .next()
        .isDone();
    });
  });
});
