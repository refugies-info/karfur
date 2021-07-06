import { SagaIterator } from "redux-saga";
import { fork } from "redux-saga/effects";
import usersSaga from "./User/user.saga";
import languagesSaga from "./Languages/languages.saga";
import contentsSaga from "./Contents/contents.saga";

export function* rootSaga(): SagaIterator {
  yield fork(usersSaga);
  yield fork(languagesSaga);
  yield fork(contentsSaga);
}
