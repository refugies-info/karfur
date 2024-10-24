import { SagaIterator } from "redux-saga";
import { fork } from "redux-saga/effects";
import dispositifsSaga from "./ActiveDispositifs/activeDispositifs.saga";
import structuresNewSaga from "./ActiveStructures/activeStructures.saga";
import activeUsersSaga from "./ActiveUsers/activeUsers.saga";
import allDispositifsSaga from "./AllDispositifs/allDispositifs.saga";
import allStructuresSaga from "./AllStructures/allStructures.saga";
import allUsersSaga from "./AllUsers/allUsers.saga";
import dispositifsWithTranslationsStatus from "./DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.saga";
import langueSaga from "./Langue/langue.saga";
import needs from "./Needs/needs.saga";
import selectedDispositifSaga from "./SelectedDispositif/selectedDispositif.saga";
import selectedStructureSaga from "./SelectedStructure/selectedStructure.saga";
import themes from "./Themes/themes.saga";
import userSaga from "./User/user.saga";
import userContributionsSaga from "./UserContributions/userContributions.saga";
import userFavoritesSaga from "./UserFavoritesInLocale/UserFavoritesInLocale.saga";
import structuresSaga from "./UserStructure/userStructure.saga";
import widgets from "./Widgets/widgets.saga";

export function* rootSaga(): SagaIterator {
  yield fork(userSaga);
  yield fork(structuresSaga);
  yield fork(langueSaga);
  yield fork(dispositifsSaga);
  yield fork(selectedDispositifSaga);
  yield fork(structuresNewSaga);
  yield fork(selectedStructureSaga);
  yield fork(allDispositifsSaga);
  yield fork(allStructuresSaga);
  yield fork(allUsersSaga);
  yield fork(activeUsersSaga);
  yield fork(userFavoritesSaga);
  yield fork(userContributionsSaga);
  yield fork(dispositifsWithTranslationsStatus);
  yield fork(needs);
  yield fork(themes);
  yield fork(widgets);
}
