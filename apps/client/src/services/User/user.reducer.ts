import { createReducer } from "typesafe-actions";
import { UserActions } from "./user.actions";
import { GetUserInfoResponse, Id, RoleName, StructureMemberRole } from "@refugies-info/api-types";

export interface UserState {
  userId: Id | null;
  user: GetUserInfoResponse | null;
  // roles
  admin: boolean;
  traducteur: boolean;
  expertTrad: boolean;
  contributeur: boolean;
  caregiver: boolean;
  hasStructure: boolean;
  rolesInStructure: StructureMemberRole[];
}
export const initialUserState: UserState = {
  userId: null,
  user: null,

  admin: false,
  traducteur: false,
  expertTrad: false,
  contributeur: false,
  caregiver: false,
  hasStructure: false,
  rolesInStructure: []
};

export const userReducer = createReducer<UserState, UserActions>(initialUserState, {
  SET_USER: (state, action) => ({
    ...state,
    userId: action.payload?._id || null,
    user: action.payload,

    admin: (action.payload?.roles || []).some((x) => x.nom === RoleName.ADMIN),
    traducteur: (action.payload?.roles || []).some((x) => x.nom === RoleName.TRAD),
    expertTrad: (action.payload?.roles || []).some((x) => x.nom === RoleName.EXPERT_TRAD),
    contributeur: (action.payload?.roles || []).some((x) => x.nom === RoleName.CONTRIB),
    caregiver: (action.payload?.roles || []).some((x) => x.nom === RoleName.CAREGIVER),
    hasStructure: (action.payload?.structures || []).length > 0
  }),
  SET_USER_ROLE_IN_STRUCTURE: (state, action) => ({ ...state, rolesInStructure: action.payload })
});
