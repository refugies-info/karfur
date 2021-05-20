import { SagaIterator } from "redux-saga";
import { fork } from "redux-saga/effects";
import languagesSaga from "./Languages/languages.saga";

export function* rootSaga(): SagaIterator {
  yield fork(languagesSaga);
}
