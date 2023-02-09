import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, all } from "redux-saga/effects";
import API from "../../utils/API";
import { ADD_TRAD_DISP, UPDATE_TRAD } from "./translation.actionTypes";
import { setTranslationActionCreator, fetchTranslationsActionCreator } from "./translation.actions";
import { logger } from "../../logger";

export function* addTranslation(action: any): SagaIterator {
  try {
    const data = yield call(API.add_tradForReview, action.payload);
    yield put(setTranslationActionCreator(data.data.data));
    yield put(fetchTranslationsActionCreator(data.data.data.articleId, data.data.data.langueCible));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while fetching translation", { error: message });
  }
}

export function* updateTranslation(action: any): SagaIterator {
  try {
    const data = yield call(API.update_tradForReview, action.payload);
    yield put(setTranslationActionCreator(data.data.data));
    yield put(fetchTranslationsActionCreator(data.data.data.articleId, data.data.data.langueCible));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while fetching translation", { error: message });
  }
}

function* latestActionsSaga() {
  yield all([takeLatest(ADD_TRAD_DISP, addTranslation), takeLatest(UPDATE_TRAD, updateTranslation)]);
}

export default latestActionsSaga;
