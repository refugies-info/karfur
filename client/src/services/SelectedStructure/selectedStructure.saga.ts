import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, select } from "redux-saga/effects";
import API from "../../utils/API";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { FETCH_SELECTED_STRUCTURE, UPDATE_SELECTED_STRUCTURE } from "./selectedStructure.actionTypes";
import {
  fetchSelectedStructureActionCreator,
  setSelectedStructureActionCreator,
  updateSelectedStructureActionCreator
} from "./selectedStructure.actions";
import { selectedStructureSelector } from "./selectedStructure.selector";

export function* fetchSelectedStructure(
  action: ReturnType<typeof fetchSelectedStructureActionCreator>
): SagaIterator {
  try {
    const { id, locale } = action.payload;
    yield put(startLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE));
    logger.info("[fetchSelectedStructure] fetching structure", { id, locale });
    const data = yield call(API.getStructureById, id, true, locale, true);
    yield put(setSelectedStructureActionCreator(data.data.data));
    yield put(finishLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE));
  } catch (error) {
    logger.error("[fetchSelectedStructure] Error while fetching structure", {
      error,
    });
    yield put(setSelectedStructureActionCreator(null));
    yield put(finishLoading(LoadingStatusKey.FETCH_SELECTED_STRUCTURE));
  }
}

export function* updateSelectedStructure(
  action: ReturnType<typeof updateSelectedStructureActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.UPDATE_SELECTED_STRUCTURE));
    logger.info("[updateSelectedStructure] updating user structure");
    let structureId;
    const structure = yield select(selectedStructureSelector);
    structureId = structure._id;
    if (!structure) {
      logger.info("[updateSelectedStructure] no structure to update");
      return;
    }
    delete structure.membres;
    yield call(API.updateStructure, { query: structure });

    yield put(
      fetchSelectedStructureActionCreator({
        id: structureId,
        locale: action.payload.locale
      })
    );
    logger.info("[updateSelectedStructure] successfully updated user structure");
    yield put(finishLoading(LoadingStatusKey.UPDATE_SELECTED_STRUCTURE));
  } catch (error) {
    logger.error("[updateSelectedStructure] error while updating user structure", {
      error,
    });
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_SELECTED_STRUCTURE, fetchSelectedStructure);
  yield takeLatest(UPDATE_SELECTED_STRUCTURE, updateSelectedStructure);
}

export default latestActionsSaga;
