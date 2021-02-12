import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import { FETCH_USER } from "./user.actionTypes";
import API from "../../utils/API";
import { setUserActionCreator, fetchUserActionCreator } from "./user.actions";
import { push } from "connected-react-router";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { fetchUserStructureActionCreator } from "../UserStructure/userStructure.actions";

export function* fetchUser(
  action: ReturnType<typeof fetchUserActionCreator>
): SagaIterator {
  try {
    logger.info("fetchUser saga");
    yield put(startLoading(LoadingStatusKey.FETCH_USER));
    const isAuth = yield call(API.isAuth);
    if (isAuth) {
      const data = yield call(API.get_user_info);
      const user = data.data.data;
      yield put(setUserActionCreator(user));
      if (user.structures && user.structures.length > 0) {
        yield put(
          fetchUserStructureActionCreator({
            structureId: user.structures[0],
            shouldRedirect: false,
          })
        );
      }
    } else {
      yield put(setUserActionCreator(null));
    }
    yield put(finishLoading(LoadingStatusKey.FETCH_USER));
    logger.info("fetchUser saga finish");

    if (action.payload && action.payload.shouldRedirect) {
      yield put(
        push({
          pathname: "/backend/user-dashboard",
          state: { user: action.payload.user },
        })
      );
    }
  } catch (error) {
    logger.error("Error while fetching user", { error });
    yield put(setUserActionCreator(null));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_USER, fetchUser);
}

export default latestActionsSaga;
