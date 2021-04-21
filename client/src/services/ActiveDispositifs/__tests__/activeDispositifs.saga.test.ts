// @ts-nocheck
import { testSaga } from "redux-saga-test-plan";
import latestActionsSaga, {
  fetchActiveDispositifs,
  updateDispositifReaction,
} from "../activeDispositifs.saga";
import API from "../../../utils/API";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../../LoadingStatus/loadingStatus.actions";
import { setActiveDispositifsActionsCreator } from "../activeDispositifs.actions";
import { languei18nSelector } from "../../Langue/langue.selectors";
import { UPDATE_DISPOSITIF_REACTION } from "../activeDispositifs.actionTypes";
import { fetchUserStructureActionCreator } from "../../UserStructure/userStructure.actions";

describe("[Saga] Active dispositifs", () => {
  describe("pilot", () => {
    it("should trigger all the active dispositifs sagas", () => {
      testSaga(latestActionsSaga)
        .next()
        .takeLatest("FETCH_ACTIVE_DISPOSITIFS", fetchActiveDispositifs)
        .next()
        .takeLatest("UPDATE_DISPOSITIF_REACTION", updateDispositifReaction)
        .next()
        .isDone();
    });
  });

  describe("fetch active dispositifs saga", () => {
    it("should call api", () => {
      testSaga(fetchActiveDispositifs)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS))
        .next()
        .select(languei18nSelector)
        .next("langue")
        .call(API.getDispositifs, {
          query: { status: "Actif" },
          locale: "langue",
        })
        .next({ data: { data: [{ id: "id" }] } })
        .put(setActiveDispositifsActionsCreator([{ id: "id" }]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS))
        .next()
        .isDone();
    });

    it("should call api put [] when getDispositifs throw", () => {
      testSaga(fetchActiveDispositifs)
        .next()
        .put(startLoading(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS))
        .next()
        .select(languei18nSelector)
        .next("langue")
        .call(API.getDispositifs, {
          query: { status: "Actif" },
          locale: "langue",
        })
        .throw(new Error("error"))
        .put(setActiveDispositifsActionsCreator([]))
        .next()
        .put(finishLoading(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS))
        .next()
        .isDone();
    });
  });

  describe("updateDispositifReaction", () => {
    const dispositif = {
      dispositifId: "dispoId",
      suggestionId: "suggestId",
      type: "read",
      fieldName: "suggestions",
    };
    it("should callupdateDispositifReactions", () => {
      testSaga(updateDispositifReaction, {
        type: UPDATE_DISPOSITIF_REACTION,
        payload: {
          structureId: "id",
          dispositif,
        },
      })
        .next()
        .call(API.updateDispositifReactions, dispositif)
        .next()
        .put(
          fetchUserStructureActionCreator({
            structureId: "id",
            shouldRedirect: true,
          })
        )
        .next()
        .isDone();
    });
  });
});
