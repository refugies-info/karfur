import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import { FETCH_USER } from "./user.actionTypes";
import API from "../../utils/API";
import { setUserActionCreator } from "./user.actions";

export function* fetchUser(): SagaIterator {
  try {
    const isAuth = yield call(API.isAuth);
    if (isAuth) {
      const data = yield call(API.get_user_info);
      yield put(setUserActionCreator(data.data.data));
    } else {
      yield put(setUserActionCreator(null));
    }
  } catch (error) {
    console.log("Error while fetching user", { error });
    yield put(setUserActionCreator(null));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_USER, fetchUser);
}

export default latestActionsSaga;
