import { updateObject } from "../utility";
import { createReducer } from "typesafe-actions";
import { StructuresActions } from "./structures.actions";
import { SimplifiedStructure } from "../../@types/interface";

export type StructuresState = SimplifiedStructure[];

const initialStructuresState: StructuresState = [];

export const structuresReducer = createReducer<
  StructuresState,
  StructuresActions
>(initialStructuresState, {
  SET_STRUCTURES_NEW: (state, action) => updateObject(state, action.payload),
});
