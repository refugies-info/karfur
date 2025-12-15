import type { GetStructureResponse } from "@refugies-info/api-types";
import { createReducer } from "typesafe-actions";
import type { UserStructureActions } from "./userStructure.actions";

export type UserStructureState = GetStructureResponse | null;

const initialUserStructureState: UserStructureState = null;

export const structureReducer = createReducer<UserStructureState, UserStructureActions>(
  initialUserStructureState,
  {
    SET_USER_STRUCTURE: (_, action) => action.payload,
  },
);
