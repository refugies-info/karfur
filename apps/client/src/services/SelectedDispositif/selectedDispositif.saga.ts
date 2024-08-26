import API from "@/utils/API";
import { GetDispositifResponse } from "@refugies-info/api-types";
import { logger } from "logger";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { LoadingStatusKey, finishLoading, startLoading } from "../LoadingStatus/loadingStatus.actions";
import { fetchSelectedDispositifActionCreator, setSelectedDispositifActionCreator } from "./selectedDispositif.actions";
import { FETCH_SELECTED_DISPOSITIF } from "./selectedDispositif.actionTypes";

export function* fetchSelectedDispositif(
  action: ReturnType<typeof fetchSelectedDispositifActionCreator>,
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_SELECTED_DISPOSITIF));
    const { selectedDispositifId, locale } = action.payload;
    logger.info("[fetchSelectedDispositif] start fetching selected dispositif", { id: selectedDispositifId, locale });
    if (selectedDispositifId) {
      const data: GetDispositifResponse = yield call(API.getDispositif, selectedDispositifId, locale, {
        token: action.payload.token,
      });
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
