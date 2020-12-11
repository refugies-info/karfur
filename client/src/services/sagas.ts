import { SagaIterator } from "redux-saga";
import { fork } from "redux-saga/effects";
import userSaga from "./User/user.saga";
import structuresSaga from "./UserStructure/userStructure.saga";
import structuresNewSaga from "./ActiveStructures/activeStructures.saga";
import selectedStructureSaga from "./SelectedStructure/selectedStructure.saga";
import langueSaga from "./Langue/langue.saga";
import dispositifsSaga from "./ActiveDispositifs/activeDispositifs.saga";
import allDispositifsSaga from "./AllDispositifs/allDispositifs.saga";
import allStructuresSaga from "./AllStructures/allStructures.saga";
import selectedDispositifSaga from "./SelectedDispositif/selectedDispositif.saga";
import translationsSaga from "./Translation/translation.saga";

export function* rootSaga(): SagaIterator {
  yield fork(userSaga);
  yield fork(structuresSaga);
  yield fork(langueSaga);
  yield fork(dispositifsSaga);
  yield fork(selectedDispositifSaga);
  yield fork(translationsSaga);
  yield fork(structuresNewSaga);
  yield fork(selectedStructureSaga);
  yield fork(allDispositifsSaga);
  yield fork(allStructuresSaga);
}
