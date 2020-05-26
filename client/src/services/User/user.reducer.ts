import { updateObject } from "../utility";
import { User, Role } from "../../@types/interface";
import { createReducer } from "typesafe-actions";
import { ObjectId } from "mongodb";
import { UserActions } from "./user.actions";

export interface UserState {
  user: User | null;
  admin: boolean;
  traducteur: boolean;
  expertTrad: boolean;
  contributeur: boolean;
  membreStruct: boolean;
  userId: ObjectId | "";
}
const initialUserState: UserState = {
  user: null,
  admin: false,
  traducteur: false,
  expertTrad: false,
  contributeur: false,
  membreStruct: false,
  userId: "",
};

export const userReducer = createReducer<UserState, UserActions>(
  initialUserState,
  {
    SET_USER: (state, action) =>
      updateObject(state, {
        user: action.payload,
        userId: action.payload ? action.payload._id : "",
        admin:
          action.payload && action.payload.roles
            ? action.payload.roles.some((x: Role) => x.nom === "Admin")
            : false,
        traducteur:
          action.payload && action.payload.roles
            ? action.payload.roles.some((x: Role) => x.nom === "Trad")
            : false,
        expertTrad:
          action.payload && action.payload.roles
            ? action.payload.roles.some((x: Role) => x.nom === "ExpertTrad")
            : false,
        contributeur:
          action.payload && action.payload.roles
            ? action.payload.roles.some((x: Role) => x.nom === "Contrib")
            : false,
        membreStruct:
          action.payload && action.payload.roles
            ? action.payload.roles.some((x: Role) => x.nom === "hasStructure")
            : false,
      }),
    UPDATE_USER: (state, action) =>
      updateObject(state, { user: action.payload }),
  }
);
