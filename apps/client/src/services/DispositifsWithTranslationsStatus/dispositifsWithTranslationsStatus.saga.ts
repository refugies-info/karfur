import { GetDispositifsWithTranslationAvancementResponse } from "@refugies-info/api-types";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { logger } from "../../logger";
import API from "../../utils/API";
import { LoadingStatusKey, finishLoading, startLoading } from "../LoadingStatus/loadingStatus.actions";
import { FETCH_DISPOSITIFS_TRANSLATIONS_STATUS } from "./dispositifsWithTranslationsStatus.actionTypes";
import {
  fetchDispositifsWithTranslationsStatusActionCreator,
  setDispositifsWithTranslationsStatusActionCreator,
} from "./dispositifsWithTranslationsStatus.actions";

export function* fetchDispositifTranslationsStatus(
  action: ReturnType<typeof fetchDispositifsWithTranslationsStatusActionCreator>,
): SagaIterator {
  try {
    logger.info("[fetchDispositifTranslationsStatus] saga", {
      locale: action.payload,
    });
    yield put(startLoading(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS));
    const data: GetDispositifsWithTranslationAvancementResponse[] = yield call(
      API.getDispositifsWithTranslationAvancement,
      action.payload,
    );
    yield put(setDispositifsWithTranslationsStatusActionCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS));
  } catch (error) {
    logger.error("[fetchDispositifTranslationsStatus] saga error", { error });
    yield put(setDispositifsWithTranslationsStatusActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_DISPOSITIFS_TRANSLATIONS_STATUS, fetchDispositifTranslationsStatus);
}

export default latestActionsSaga;
