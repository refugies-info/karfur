import { createReducer } from "typesafe-actions";
import { StructuresActions } from "./activeStructures.actions";
import { SimplifiedStructure } from "../../@types/interface";

export type ActiveStructuresState = SimplifiedStructure[];

const initialActiveStructuresState: ActiveStructuresState = [];

export const activeStructuresReducer = createReducer<
  ActiveStructuresState,
  StructuresActions
>(initialActiveStructuresState, {
  SET_ACTIVE_STRUCTURES: (_, action) => action.payload,
});
