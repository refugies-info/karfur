import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import {
  startLoading,
  finishLoading,
  LoadingStatusKey,
} from "../LoadingStatus/loadingStatus.actions";
import { logger } from "../../../logger";
import {
  fetchContentsActionCreator,
  setContentsActionCreator,
} from "./contents.actions";
import { FETCH_CONTENTS } from "./contents.actionTypes";

export function* fetchContents(
  action: ReturnType<typeof fetchContentsActionCreator>
): SagaIterator {
  try {
    logger.info("[fetchContents] saga");
    const langueI18nCode = action.payload;
    yield put(startLoading(LoadingStatusKey.FETCH_CONTENTS));
    // const data = yield call(getLanguages);

    yield put(
      setContentsActionCreator({ langue: langueI18nCode, contents: [] })
    );
    yield put(finishLoading(LoadingStatusKey.FETCH_CONTENTS));
  } catch (error) {
    logger.error("Error while fetching contents", { error: error.message });
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_CONTENTS, fetchContents);
}

export default latestActionsSaga;
