import { updateObject } from "../utility";
import { createReducer } from "typesafe-actions";
import { StructureActions } from "./structure.actions";
import { Structure } from "../../@types/interface";

export type StructureState = Structure | null;

const initialStructureState: StructureState = null;

export const structureReducer = createReducer<StructureState, StructureActions>(
  initialStructureState,
  {
    SET_USER_STRUCTURE: (state, action) => action.payload,
  }
);
