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
import { GET_NEEDS } from "./needs.actionTypes";
import { setNeedsActionCreator } from "./needs.actions";

export function* fetchNeeds(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_NEEDS));
    logger.info("[fetchNeeds] start fetching needs");
    const data = yield call(API.getNeeds);

    const needs = data && data.data && data.data.data ? data.data.data : [];
    yield put(setNeedsActionCreator(needs));

    yield put(finishLoading(LoadingStatusKey.FETCH_SELECTED_DISPOSITIF));
  } catch (error) {
    logger.error("Error while fetching needs ", {
      error: error.message,
    });
  }
}

function* latestActionsSaga() {
  yield takeLatest(GET_NEEDS, fetchNeeds);
}

export default latestActionsSaga;
