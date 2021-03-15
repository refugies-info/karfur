import { SagaIterator } from "redux-saga";
import { takeLatest, put, call, select } from "redux-saga/effects";
import API from "../../utils/API";
import {
  FETCH_USER_STRUCTURE,
  UPDATE_USER_STRUCTURE,
} from "./userStructure.actionTypes";
import {
  fetchUserStructureActionCreator,
  setUserStructureActionCreator,
} from "./userStructure.actions";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { userStructureSelector } from "./userStructure.selectors";
import { userSelector } from "../User/user.selectors";
import { push } from "connected-react-router";
import { setUserRoleInStructureActionCreator } from "../User/user.actions";

export function* fetchUserStructure(
  action: ReturnType<typeof fetchUserStructureActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE));
    logger.info("[fetchUserStructure] fetching user structure");
    const { structureId, shouldRedirect } = action.payload;
    const data = yield call(API.getStructureById, structureId, true, "fr");
    yield put(setUserStructureActionCreator(data.data.data));

    const user = yield select(userSelector);
    const userId = user.userId;
    const structureMembers = data.data.data ? data.data.data.membres : [];
    const userInStructure = structureMembers.filter(
      (member: any) => member.userId === userId
    );

    const userRoles =
      userInStructure.length > 0 ? userInStructure[0].roles : [];

    const isUserContribOrAdmin =
      userRoles.includes("administrateur") ||
      userRoles.includes("contributeur");

    yield put(setUserRoleInStructureActionCreator(userRoles));
    if (shouldRedirect && !isUserContribOrAdmin) {
      yield put(push("/"));
    }

    logger.info("[fetchUserStructure] successfully fetched user structure");
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE));
  } catch (error) {
    logger.error("[fetchUserStructure] error while fetching user structure", {
      error,
    });
  }
}

export function* updateUserStructure(): SagaIterator {
  try {
    logger.info("[updateUserStructure] updating user structure");
    const structure = yield select(userStructureSelector);
    if (!structure) {
      logger.info("[updateUserStructure] no structure to update");
      return;
    }
    yield call(API.updateStructure, { query: structure });
    yield put(
      fetchUserStructureActionCreator({
        structureId: structure._id,
        shouldRedirect: true,
      })
    );
    logger.info("[updateUserStructure] successfully updated user structure");
  } catch (error) {
    logger.error("[updateUserStructure] error while updating user structure", {
      error,
    });
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_USER_STRUCTURE, fetchUserStructure);
  yield takeLatest(UPDATE_USER_STRUCTURE, updateUserStructure);
}

export default latestActionsSaga;
