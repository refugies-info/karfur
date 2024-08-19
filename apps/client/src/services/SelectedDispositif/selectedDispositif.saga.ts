import { SagaIterator } from "redux-saga";
import { takeLatest, call, put } from "redux-saga/effects";
import API from "utils/API";
import { logger } from "logger";
import {
  fetchSelectedDispositifActionCreator,
  setSelectedDispositifActionCreator,
} from "./selectedDispositif.actions";
import { FETCH_SELECTED_DISPOSITIF } from "./selectedDispositif.actionTypes";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { GetDispositifResponse } from "@refugies-info/api-types";

export function* fetchSelectedDispositif(
  action: ReturnType<typeof fetchSelectedDispositifActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_SELECTED_DISPOSITIF));
    const { selectedDispositifId, locale } = action.payload;
    logger.info(
      "[fetchSelectedDispositif] start fetching selected dispositif",
      { id: selectedDispositifId, locale }
    );
    if (selectedDispositifId) {
      const data: GetDispositifResponse = yield call(API.getDispositif, selectedDispositifId, locale, { token: action.payload.token });
      if (data) {
        yield put(setSelectedDispositifActionCreator(data, true));
      }
    }

    yield put(finishLoading(LoadingStatusKey.FETCH_SELECTED_DISPOSITIF));
  } catch (error) {
    logger.error("Error while fetching selected dispositif", {
      dispositifId: action.payload.selectedDispositifId,
      locale: action.payload.locale,
      error,
    });
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_SELECTED_DISPOSITIF, fetchSelectedDispositif);
}

export default latestActionsSaga;
