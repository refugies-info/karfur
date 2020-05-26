import { SagaIterator } from "redux-saga";
import { fork } from "redux-saga/effects";
import userSaga from "./User/user.saga";
import structuresSaga from "./Structures/structures.saga";
import langueSaga from "./Langue/langue.saga";
import dispositifsSaga from "./Dispositif/dispositif.saga";

export function* rootSaga(): SagaIterator {
  yield fork(userSaga);
  yield fork(structuresSaga);
  yield fork(langueSaga);
  yield fork(dispositifsSaga);
}
