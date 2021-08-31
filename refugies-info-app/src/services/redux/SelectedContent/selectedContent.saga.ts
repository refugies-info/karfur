import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import {
  startLoading,
  finishLoading,
  LoadingStatusKey,
} from "../LoadingStatus/loadingStatus.actions";
import { get_dispositif } from "../../../utils/API";
import { logger } from "../../../logger";
import {
  fetchSelectedContentActionCreator,
  setSelectedContentActionCreator,
} from "./selectedContent.actions";
import { FETCH_SELECTED_CONTENT } from "./selectedContent.actionTypes";

export function* fetchSelectedContent(
  action: ReturnType<typeof fetchSelectedContentActionCreator>
): SagaIterator {
  const { contentId, locale } = action.payload;
  try {
    logger.info("[fetchSelectedContent] saga", { contentId, locale });
    yield put(startLoading(LoadingStatusKey.FETCH_SELECTED_CONTENT));

    const data = yield call(get_dispositif, {
      query: { _id: contentId },
      sort: {},
      populate: "mainSponsor",

      locale,
    });
    const contentLocale =
      data && data.data && data.data.data && data.data.data.length > 0
        ? data.data.data[0]
        : null;
    yield put(
      setSelectedContentActionCreator({ content: contentLocale, locale })
    );
    if (locale !== "fr") {
      const dataFr = yield call(get_dispositif, {
        query: { _id: contentId },
        sort: {},
        populate: "mainSponsor",
        locale: "fr",
      });
      const contentFr =
        dataFr && dataFr.data && dataFr.data.data && dataFr.data.data.length > 0
          ? dataFr.data.data[0]
          : null;
      yield put(
        setSelectedContentActionCreator({
          content: contentFr,
          locale: "fr",
        })
      );
    }
    yield put(finishLoading(LoadingStatusKey.FETCH_SELECTED_CONTENT));
  } catch (error) {
    logger.error("Error while getting content", { error: error.message });
    yield put(setSelectedContentActionCreator({ content: null, locale }));
    yield put(setSelectedContentActionCreator({ content: null, locale: "fr" }));
    yield put(finishLoading(LoadingStatusKey.FETCH_SELECTED_CONTENT));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_SELECTED_CONTENT, fetchSelectedContent);
}

export default latestActionsSaga;
