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
  try {
    const id = action.payload;
    logger.info("[fetchSelectedContent] saga", { id });
    yield put(startLoading(LoadingStatusKey.FETCH_SELECTED_CONTENT));
    const data = yield call(get_dispositif, {
      query: { _id: id },
      sort: {},
      locale: "fr",
    });
    const content =
      data && data.data && data.data.data && data.data.data.length > 0
        ? data.data.data[0]
        : null;
    yield put(setSelectedContentActionCreator(content));
    yield put(finishLoading(LoadingStatusKey.FETCH_SELECTED_CONTENT));
  } catch (error) {
    logger.error("Error while getting content", { error: error.message });
    yield put(setSelectedContentActionCreator(null));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_SELECTED_CONTENT, fetchSelectedContent);
}

export default latestActionsSaga;
