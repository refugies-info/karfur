import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, select } from "redux-saga/effects";
import { languei18nSelector } from "../Langue/langue.selectors";
import API from "../../utils/API";
import {
  FETCH_ACTIVE_DISPOSITIFS,
  UPDATE_DISPOSITIF_REACTION,
} from "./activeDispositifs.actionTypes";
import {
  setActiveDispositifsActionsCreator,
  updateDispositifReactionActionCreator,
} from "./activeDispositifs.actions";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
  setError,
} from "../LoadingStatus/loadingStatus.actions";
import { fetchUserStructureActionCreator } from "../UserStructure/userStructure.actions";
import { GetDispositifsResponse } from "@refugies-info/api-types";

export function* fetchActiveDispositifs(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));

    const langue = yield select(languei18nSelector);
    const data: GetDispositifsResponse[] = yield call(API.getDispositifs, { locale: langue });

    yield put(setActiveDispositifsActionsCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));
  } catch (error) {
    logger.error("Error while fetching dispositifs", { error });
    yield put(setActiveDispositifsActionsCreator([]));
    yield put(setError(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS, "Error while fetching dispositifs"));
  }
}

export function* updateDispositifReaction(
  action: ReturnType<typeof updateDispositifReactionActionCreator>
): SagaIterator {
  try {
    const { suggestion, structureId } = action.payload;
    logger.info("[updateDispositifReaction] updating dispositif reaction", {
      suggestion,
      structureId,
    });
    if (suggestion.type === "remove") {
      yield call(API.deleteDispositifSuggestion, suggestion.dispositifId.toString(), suggestion.suggestionId);
    }
    if (suggestion.type === "read") {
      yield call(API.readDispositifSuggestion, suggestion.dispositifId.toString(), { suggestionId: suggestion.suggestionId });
    }
    yield put(
      fetchUserStructureActionCreator({
        structureId,
        shouldRedirect: false,
      })
    );
    logger.info(
      "[updateDispositifReaction] successfully updated user structure"
    );
  } catch (error) {
    logger.error(
      "[updateDispositifReaction] error while updating user structure",
      {
        error,
      }
    );
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_ACTIVE_DISPOSITIFS, fetchActiveDispositifs);
  yield takeLatest(UPDATE_DISPOSITIF_REACTION, updateDispositifReaction);
}

export default latestActionsSaga;
