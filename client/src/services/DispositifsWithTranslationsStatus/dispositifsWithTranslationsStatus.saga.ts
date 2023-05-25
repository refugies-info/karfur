import { SagaIterator } from "redux-saga";
import { logger } from "../../logger";
import { put, call, takeLatest } from "redux-saga/effects";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import API from "../../utils/API";
import { FETCH_DISPOSITIFS_TRANSLATIONS_STATUS } from "./dispositifsWithTranslationsStatus.actionTypes";
import {
  fetchDispositifsWithTranslationsStatusActionCreator,
  setDispositifsWithTranslationsStatusActionCreator,
} from "./dispositifsWithTranslationsStatus.actions";
import { GetDispositifsWithTranslationAvancementResponse } from "@refugies-info/api-types";

export function* fetchDispositifTranslationsStatus(
  action: ReturnType<typeof fetchDispositifsWithTranslationsStatusActionCreator>
): SagaIterator {
  try {
    logger.info("[fetchDispositifTranslationsStatus] saga", {
      locale: action.payload,
    });
    yield put(
      startLoading(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS)
    );
    const data: GetDispositifsWithTranslationAvancementResponse[] = yield call(API.getDispositifsWithTranslationAvancement, action.payload);
    yield put(
      setDispositifsWithTranslationsStatusActionCreator(data)
    );
    yield put(
      finishLoading(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS)
    );
  } catch (error) {
    logger.error("[fetchDispositifTranslationsStatus] saga error", { error });
    yield put(setDispositifsWithTranslationsStatusActionCreator([]));
    yield put(
      finishLoading(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS)
    );
  }
}

function* latestActionsSaga() {
  yield takeLatest(
    FETCH_DISPOSITIFS_TRANSLATIONS_STATUS,
    fetchDispositifTranslationsStatus
  );
}

export default latestActionsSaga;
