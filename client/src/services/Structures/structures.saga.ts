import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import API from "../../utils/API";
import {
  FETCH_STRUCTURES,
  FETCH_USER_STRUCTURE,
  UPDATE_USER_STRUCTURE,
} from "./structures.actionTypes";
import {
  setStructuresActionCreator,
  fetchUserStructureActionCreator,
  setUserStructureActionCreator,
  updateUserStructureActionCreator,
} from "./structures.actions";
import { logger } from "../../logger";

export function* fetchStructures(): SagaIterator {
  try {
    const data = yield call(API.get_structure, { status: "Actif" });
    yield put(setStructuresActionCreator(data.data.data));
  } catch (error) {
    logger.error("Error while fetching structures", { error });
    yield put(setStructuresActionCreator([]));
  }
}

export function* fetchUserStructure(
  action: ReturnType<typeof fetchUserStructureActionCreator>
): SagaIterator {
  try {
    logger.info("[fetchUserStructure] fetching user structure");
    const { structureId } = action.payload;
    const data = yield call(API.get_structure, { _id: structureId }, {});
    yield put(setUserStructureActionCreator(data.data.data[0]));
    logger.info("[fetchUserStructure] successfully fetched user structure");
  } catch (error) {
    logger.error("[fetchUserStructure] error while fetching user structure", {
      error,
    });
  }
}

export function* updateUserStructure(
  action: ReturnType<typeof updateUserStructureActionCreator>
): SagaIterator {
  try {
    logger.info("[fetchUserStructure] updating user structure");
    // const { structureId } = action.payload;
    // const data = yield call(API.get_structure, { _id: structureId }, {});
    // yield put(setUserStructureActionCreator(data.data.data[0]));
    logger.info("[fetchUserStructure] successfully fetched user structure");
  } catch (error) {
    logger.error("[fetchUserStructure] error while updating user structure", {
      error,
    });
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_STRUCTURES, fetchStructures);
  yield takeLatest(FETCH_USER_STRUCTURE, fetchUserStructure);
  yield takeLatest(UPDATE_USER_STRUCTURE, updateUserStructure);
}

export default latestActionsSaga;
