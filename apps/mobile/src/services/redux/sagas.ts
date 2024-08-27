import { SagaIterator } from "redux-saga";
import { fork } from "redux-saga/effects";
import contentsSaga from "./Contents/contents.saga";
import languagesSaga from "./Languages/languages.saga";
import needSaga from "./Needs/needs.saga";
import selectedContentSaga from "./SelectedContent/selectedContent.saga";
import themeSaga from "./Themes/themes.saga";
import usersSaga from "./User/user.saga";

export function* rootSaga(): SagaIterator {
  yield fork(usersSaga);
  yield fork(languagesSaga);
  yield fork(contentsSaga);
  yield fork(selectedContentSaga);
  yield fork(needSaga);
  yield fork(themeSaga);
}
