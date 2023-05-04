import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import API from "../../utils/API";
import { FETCH_ALL_STRUCTURES } from "./allStructures.actionTypes";
import { setAllStructuresActionCreator } from "./allStructures.actions";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { GetAllStructuresResponse } from "api-types";
import { APIResponse } from "types/interface";

export function* fetchAllStructures(): SagaIterator {
  try {
    logger.info("[fetchAllStructures saga]");
    yield put(startLoading(LoadingStatusKey.FETCH_ALL_STRUCTURES));
    const data: APIResponse<GetAllStructuresResponse[]> = yield call(API.getAllStructures);
    yield put(setAllStructuresActionCreator(data.data.data));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_STRUCTURES));
  } catch (error) {
    logger.error("[fetchAllStructures saga] Error while fetching structures", {
      error,
    });
    yield put(setAllStructuresActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_ALL_STRUCTURES));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_ALL_STRUCTURES, fetchAllStructures);
}

export default latestActionsSaga;
