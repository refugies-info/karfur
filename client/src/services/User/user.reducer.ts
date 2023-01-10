import { User, Role } from "../../types/interface";
import { createReducer } from "typesafe-actions";
import { ObjectId } from "mongodb";
import { UserActions } from "./user.actions";

export interface UserState {
  user: User | null;
  admin: boolean;
  traducteur: boolean;
  expertTrad: boolean;
  contributeur: boolean;
  hasStructure: boolean;
  userId: ObjectId | "";
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
    admin: action.payload && action.payload.roles ? action.payload.roles.some((x: Role) => x.nom === "Admin") : false,
    traducteur:
      action.payload && action.payload.roles ? action.payload.roles.some((x: Role) => x.nom === "Trad") : false,
    expertTrad:
      action.payload && action.payload.roles ? action.payload.roles.some((x: Role) => x.nom === "ExpertTrad") : false,
    contributeur:
      action.payload && action.payload.roles ? action.payload.roles.some((x: Role) => x.nom === "Contrib") : false,
    hasStructure: action.payload && action.payload.structures ? action.payload.structures.length > 0 : false
  }),
  UPDATE_USER: (state, action) => ({ ...state, user: action.payload, userFetched: true }),
  SET_USER_ROLE_IN_STRUCTURE: (state, action) => ({ ...state, rolesInStructure: action.payload })
});
