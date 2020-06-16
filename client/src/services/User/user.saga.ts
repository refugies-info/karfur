import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import { FETCH_USER } from "./user.actionTypes";
import API from "../../utils/API";
import { setUserActionCreator, fetchUserActionCreator } from "./user.actions";
import { push } from "connected-react-router";
import { logger } from "../../logger";

export function* fetchUser(
  action: ReturnType<typeof fetchUserActionCreator>
): SagaIterator {
  try {
    const isAuth = yield call(API.isAuth);
    if (isAuth) {
      const data = yield call(API.get_user_info);
      yield put(setUserActionCreator(data.data.data));
    } else {
      yield put(setUserActionCreator(null));
    }

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
