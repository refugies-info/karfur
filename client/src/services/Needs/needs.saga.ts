import { SagaIterator } from "redux-saga";
import { takeLatest, call, put } from "redux-saga/effects";
import API from "../../utils/API";
import { logger } from "../../logger";

import _ from "lodash";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { GET_NEEDS, SAVE_NEED } from "./needs.actionTypes";
import {
  setNeedsActionCreator,
  saveNeedActionCreator,
  getNeedsActionCreator,
} from "./needs.actions";

export function* fetchNeeds(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_NEEDS));
    logger.info("[fetchNeeds] start fetching needs");
    const data = yield call(API.getNeeds);

    const needs = data && data.data && data.data.data ? data.data.data : [];
    yield put(setNeedsActionCreator(needs));

    yield put(finishLoading(LoadingStatusKey.FETCH_NEEDS));
  } catch (error) {
    logger.error("Error while fetching needs ", {
      error: error.message,
    });
    yield put(setNeedsActionCreator([]));
  }
}

export function* saveNeed(
  action: ReturnType<typeof saveNeedActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.SAVE_NEED));
    const newNeed = action.payload;
    logger.info("[saveNeed] start saving need");
    yield call(API.saveNeed, { query: newNeed });
    yield put(getNeedsActionCreator());
    yield put(finishLoading(LoadingStatusKey.SAVE_NEED));
  } catch (error) {
    logger.error("Error while saving need ", {
      error: error.message,
      need: action.payload,
    });
    yield put(setNeedsActionCreator([]));
  }
}

function* latestActionsSaga() {
  yield takeLatest(GET_NEEDS, fetchNeeds);
  yield takeLatest(SAVE_NEED, saveNeed);
}

export default latestActionsSaga;
