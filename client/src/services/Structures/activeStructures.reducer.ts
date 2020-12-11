import { createReducer } from "typesafe-actions";
import { StructuresActions } from "./activeStructures.actions";
import { SimplifiedStructure } from "../../@types/interface";

export type StructuresState = SimplifiedStructure[];

const initialStructuresState: StructuresState = [];

export const structuresReducer = createReducer<
  StructuresState,
  StructuresActions
>(initialStructuresState, {
  SET_STRUCTURES_NEW: (state, action) => action.payload,
});
