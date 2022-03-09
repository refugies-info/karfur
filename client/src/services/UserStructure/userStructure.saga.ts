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
  updateUserStructureActionCreator,
} from "./userStructure.actions";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { userStructureSelector } from "./userStructure.selectors";
import { userSelector } from "../User/user.selectors";
import Router from "next/router";
import { setUserRoleInStructureActionCreator } from "../User/user.actions";

export function* fetchUserStructure(
  action: ReturnType<typeof fetchUserStructureActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE));
    logger.info("[fetchUserStructure] fetching user structure");
    const { structureId, shouldRedirect } = action.payload;
    if (!structureId) return;
    const data = yield call(
      API.getStructureById,
      structureId.toString(),
      true,
      "fr",
      true
    );
    yield put(setUserStructureActionCreator(data.data.data));
    const user = yield select(userSelector);
    const userId = user.userId;
    const structureMembers = data.data.data ? data.data.data.membres : [];
    const userInStructure = structureMembers.filter(
      (member: any) => member._id === userId
    );
    const userRoles =
      userInStructure.length > 0 ? userInStructure[0].roles : [];
    const isUserContribOrAdmin =
      userRoles.includes("administrateur") ||
      userRoles.includes("contributeur");

    yield put(setUserRoleInStructureActionCreator(userRoles));
    if (shouldRedirect && !isUserContribOrAdmin) {
      yield call(Router.push, "/");
    }

    logger.info("[fetchUserStructure] successfully fetched user structure");
    yield put(finishLoading(LoadingStatusKey.FETCH_USER_STRUCTURE));
  } catch (error) {
    logger.error("[fetchUserStructure] error while fetching user structure", {
      error,
    });
  }
}

export function* updateUserStructure(
  action: ReturnType<typeof updateUserStructureActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE));
    logger.info("[updateUserStructure] updating user structure", {
      payload: action.payload,
    });
    const { modifyMembres, data } = action.payload;
    let structureId;
    if (!modifyMembres) {
      const structure = yield select(userStructureSelector);
      structureId = structure._id;
      // we don't want to update membres because they are formatted
      delete structure.membres;
      if (!structure) {
        logger.info("[updateUserStructure] no structure to update");
        return;
      }
      yield call(API.updateStructure, { query: structure });
    } else if (data) {
      let query;
      if (data.type === "create") {
        query = {
          membreId: data.userId,
          structureId: data.structureId,
          action: "create",
          role: "contributeur",
        };
      } else if (data.type === "modify" && data.newRole) {
        query = {
          membreId: data.userId,
          structureId: data.structureId,
          action: "modify",
          role: data.newRole,
        };
      } else if (data.type === "delete") {
        query = {
          membreId: data.userId,
          structureId: data.structureId,
          action: "delete",
        };
      } else {
        throw new Error("ERROR_IN_DATA");
      }
      structureId = data.structureId;

      yield call(API.modifyUserRoleInStructure, {
        query,
      });
    } else {
      throw new Error("NO_DATA");
    }
    yield put(
      fetchUserStructureActionCreator({
        structureId: structureId,
        shouldRedirect: true,
      })
    );
    logger.info("[updateUserStructure] successfully updated user structure");
    yield put(finishLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE));
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
