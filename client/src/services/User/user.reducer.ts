import { createReducer } from "typesafe-actions";
import { UserActions } from "./user.actions";
import { GetUserInfoResponse, Id } from "api-types";

export interface UserState {
  user: GetUserInfoResponse | null;
  admin: boolean;
  traducteur: boolean;
  expertTrad: boolean;
  contributeur: boolean;
  hasStructure: boolean;
  userId: Id | "";
  userFetched: boolean;
  rolesInStructure: string[];
}
export const initialUserState: UserState = {
  user: null,
  admin: false,
  traducteur: false,
  expertTrad: false,
  contributeur: false,
  hasStructure: false,
  userId: "",
  userFetched: false,
  rolesInStructure: []
};

export const userReducer = createReducer<UserState, UserActions>(initialUserState, {
  SET_USER: (state, action) => ({
    ...state,
    userFetched: true,
    user: action.payload,
    userId: action.payload ? action.payload._id : "",
    admin: action.payload && action.payload.roles ? action.payload.roles.some((x) => x.nom === "Admin") : false,
    traducteur:
      action.payload && action.payload.roles ? action.payload.roles.some((x) => x.nom === "Trad") : false,
    expertTrad:
      action.payload && action.payload.roles ? action.payload.roles.some((x) => x.nom === "ExpertTrad") : false,
    contributeur:
      action.payload && action.payload.roles ? action.payload.roles.some((x) => x.nom === "Contrib") : false,
    hasStructure: action.payload && action.payload.structures ? action.payload.structures.length > 0 : false
  }),
  UPDATE_USER: (state, action) => ({ ...state, user: action.payload, userFetched: true }),
  SET_USER_ROLE_IN_STRUCTURE: (state, action) => ({ ...state, rolesInStructure: action.payload })
});
