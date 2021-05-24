import { SagaIterator } from "redux-saga";
import { fork } from "redux-saga/effects";
import usersSaga from "./User/user.saga";

export function* rootSaga(): SagaIterator {
  yield fork(usersSaga);
}
