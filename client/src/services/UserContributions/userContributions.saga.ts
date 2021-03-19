import { SagaIterator } from "redux-saga";
import { logger } from "../../logger";
import { put, call, takeLatest } from "redux-saga/effects";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import API from "../../utils/API";
import { FETCH_USER_CONTRIBUTIONS } from "./userContributions.actionTypes";
import { setUserContributionsActionCreator } from "./userContributions.actions";

export function* fetchUserContributions(): SagaIterator {
  try {
    logger.info("[fetchUserContributions] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS));
    const data = yield call(API.getUserContributions);
    yield put(setUserContributionsActionCreator(data.data.data));
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS));
  } catch (error) {
    logger.error("[fetchUserContributions] saga error", { error });
    yield put(setUserContributionsActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS));
  }
}

//   export function* updateUserFavorites(
//     action: ReturnType<typeof updateUserFavoritesActionCreator>
//   ): SagaIterator {
//     try {
//       logger.info("[updateUserFavorites] saga", { data: action.payload });
//       yield put(startLoading(LoadingStatusKey.UPDATE_USER_CONTRIBUTIONS));
//       yield call(API.updateUserFavorites, {
//         dispositifId: action.payload.dispositifId,
//         type: action.payload.type,
//       });
//       yield put(fetchUserContributionsActionCreator(action.payload.locale));
//       yield put(finishLoading(LoadingStatusKey.UPDATE_USER_CONTRIBUTIONS));
//     } catch (error) {
//       logger.error("[updateUserFavorites] saga error", { error });
//       yield put(finishLoading(LoadingStatusKey.UPDATE_USER_CONTRIBUTIONS));
//     }
//   }

function* latestActionsSaga() {
  yield takeLatest(FETCH_USER_CONTRIBUTIONS, fetchUserContributions);
  // yield takeLatest(UPDATE_USER_CONTRIBUTIONS, updateUserFavorites);
}

export default latestActionsSaga;
