import { GetStructureResponse, PatchStructureRequest, PatchStructureRolesRequest } from "@refugies-info/api-types";
import pick from "lodash/pick";
import Router from "next/router";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { UserState } from "~/services/User/user.reducer";
import { logger } from "../../logger";
import API from "../../utils/API";
import { LoadingStatusKey, finishLoading, startLoading } from "../LoadingStatus/loadingStatus.actions";
import { userSelector } from "../User/user.selectors";
import { FETCH_USER_STRUCTURE, UPDATE_USER_STRUCTURE } from "./userStructure.actionTypes";
import {
  fetchUserStructureActionCreator,
  setUserStructureActionCreator,
  updateUserStructureActionCreator,
} from "./userStructure.actions";
import { userStructureSelector } from "./userStructure.selectors";

export function* fetchUserStructure(action: ReturnType<typeof fetchUserStructureActionCreator>): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_USER_STRUCTURE));
    logger.info("[fetchUserStructure] fetching user structure");
    const { structureId, shouldRedirect } = action.payload;
    if (!structureId) return;
    const data: GetStructureResponse = yield call(API.getStructureById, structureId.toString(), "fr");
    yield put(setUserStructureActionCreator(data));
    const user: UserState = yield select(userSelector);
    const userId = user.userId;
    const structureMembers = data ? data.membres : [];
    const userInStructure = structureMembers.filter((member) => member.userId === userId);
    const isUserAdmin = userInStructure.length > 0;

    if (shouldRedirect && !isUserAdmin) {
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

export function* updateUserStructure(action: ReturnType<typeof updateUserStructureActionCreator>): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.UPDATE_USER_STRUCTURE));
    logger.info("[updateUserStructure] updating user structure", {
      payload: action.payload,
    });
    const { membres, structure } = action.payload;
    let structureId;
    if (structure) {
      const structureFromStore: GetStructureResponse = yield select(userStructureSelector);
      structureId = structureFromStore._id;
      if (!structure) {
        logger.info("[updateUserStructure] no structure to update");
        return;
      }
      const updatedStructure: PatchStructureRequest = pick(structure, [
        "picture",
        "contact",
        "phone_contact",
        "mail_contact",
        "responsable",
        "nom",
        "hasResponsibleSeenNotification",
        "acronyme",
        "adresse",
        "authorBelongs",
        "link",
        "mail_generique",
        "siren",
        "siret",
        "structureTypes",
        "websites",
        "facebook",
        "linkedin",
        "twitter",
        "activities",
        "departments",
        "phonesPublic",
        "mailsPublic",
        "adressPublic",
        "openingHours",
        "onlyWithRdv",
        "description",
      ]);
      yield call(API.updateStructure, structureId, updatedStructure);
      yield put(setUserStructureActionCreator({ ...structureFromStore, ...structure }));
    } else if (membres) {
      let query: PatchStructureRolesRequest | null = null;
      if (membres.type === "create") {
        query = {
          membreId: membres.userId.toString(),
          action: "create",
        };
      } else if (membres.type === "delete") {
        query = {
          membreId: membres.userId.toString(),
          action: "delete",
        };
      } else {
        throw new Error("ERROR_IN_DATA");
      }
      structureId = membres.structureId;

      yield call(API.updateStructureRoles, membres.structureId, query);
    } else {
      throw new Error("NO_DATA");
    }
    yield put(
      fetchUserStructureActionCreator({
        structureId,
        shouldRedirect: true,
      }),
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
