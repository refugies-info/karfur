import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, select } from "redux-saga/effects";
import crashlytics from "@react-native-firebase/crashlytics";

import {
  startLoading,
  finishLoading,
  LoadingStatusKey,
} from "../LoadingStatus/loadingStatus.actions";
import { logger } from "../../../logger";
import {
  setContentsActionCreator,
  setNbContentsActionCreator,
} from "./contents.actions";
import { FETCH_CONTENTS } from "./contents.actionTypes";
import { getContentsForApp, getNbContents } from "../../../utils/API";
import {
  selectedI18nCodeSelector,
  userAgeSelector,
  userLocationSelector,
  userFrenchLevelSelector,
} from "../User/user.selectors";
import { groupResultsByNeed } from "./functions";
import { setGroupedContentsActionCreator } from "../ContentsGroupedByNeeds/contentsGroupedByNeeds.actions";
import {
  GetContentsForAppResponse,
  GetNbContentsForCountyResponse,
} from "@refugies-info/api-types";

export function* fetchContents(): SagaIterator {
  try {
    logger.info("[fetchContents] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_CONTENTS));
    const selectedLanguage = yield select(selectedI18nCodeSelector);
    const age = yield select(userAgeSelector);
    const { department } = yield select(userLocationSelector);
    const frenchLevel = yield select(userFrenchLevelSelector);

    if (selectedLanguage) {
      const data: GetContentsForAppResponse = yield call(getContentsForApp, {
        locale: selectedLanguage || "fr",
        age,
        county: department,
        frenchLevel,
      });

      if (!data) {
        logger.warn("[fetchContents] saga - no data fetched", data);
        crashlytics().recordError(new Error("No content loaded"));
      }

      if (data.data && selectedLanguage !== "fr") {
        yield put(
          setContentsActionCreator({
            langue: selectedLanguage,
            contents: data.data,
          })
        );
      }
      if (data && data.dataFr) {
        yield put(
          setContentsActionCreator({
            langue: "fr",
            contents: data.dataFr,
          })
        );

        const groupedResults = yield call(groupResultsByNeed, data.dataFr);
        yield put(setGroupedContentsActionCreator(groupedResults));
      }
    }

    // Nb Content
    let nbContent: GetNbContentsForCountyResponse = {
      nbGlobalContent: null,
      nbLocalizedContent: null,
    };
    if (department) {
      nbContent = yield call(getNbContents, {
        locale: selectedLanguage || "fr",
        age,
        county: department,
        frenchLevel,
        strictLocation: true,
      });
    }
    yield put(setNbContentsActionCreator(nbContent));

    yield put(finishLoading(LoadingStatusKey.FETCH_CONTENTS));
  } catch (error: any) {
    logger.error("Error while fetching contents", {
      error: error.message,
    });
    yield put(finishLoading(LoadingStatusKey.FETCH_CONTENTS));
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_CONTENTS, fetchContents);
}

export default latestActionsSaga;
