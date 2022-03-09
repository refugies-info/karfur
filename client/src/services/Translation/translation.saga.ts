import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, all } from "redux-saga/effects";
import API from "../../utils/API";
import {
  FETCH_TRANSLATIONS,
  ADD_TRAD_DISP,
  UPDATE_TRAD,
} from "./translation.actionTypes";
import {
  setTranslationsActionCreator,
  setTranslationActionCreator,
  fetchTranslationsActionCreator,
} from "./translation.actions";
import { logger } from "../../logger";

export function* fetchTranslations(action: any): SagaIterator {
  try {
    const data = yield call(API.get_tradForReview, {
      query: {
        articleId: action.payload.itemId,
        langueCible: action.payload.locale,
      },
      sort: { updatedAt: -1 },
      populate: "userId",
    });
    if (data.data.data.constructor === Array && data.data.data.length > 0) {
      yield put(setTranslationsActionCreator(data.data.data));
    }
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while fetching translation", { error: message });
  }
}

export function* addTranslation(action: any): SagaIterator {
  try {
    const data = yield call(API.add_tradForReview, action.payload);
    yield put(setTranslationActionCreator(data.data.data));
    yield put(
      fetchTranslationsActionCreator(
        data.data.data.articleId,
        data.data.data.langueCible
      )
    );
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while fetching translation", { error: message });
  }
}

export function* updateTranslation(action: any): SagaIterator {
  try {
    const data = yield call(API.update_tradForReview, action.payload);
    yield put(setTranslationActionCreator(data.data.data));
    yield put(
      fetchTranslationsActionCreator(
        data.data.data.articleId,
        data.data.data.langueCible
      )
    );
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while fetching translation", { error: message });
  }
}

function* latestActionsSaga() {
  yield all([
    takeLatest(FETCH_TRANSLATIONS, fetchTranslations),
    takeLatest(ADD_TRAD_DISP, addTranslation),
    takeLatest(UPDATE_TRAD, updateTranslation),
  ]);
}

export default latestActionsSaga;
