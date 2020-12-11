import { SimplifiedStructureForAdmin } from "../../@types/interface";
import { createReducer } from "typesafe-actions";
import { AllStructuresActions } from "./allStructures.actions";

export type AllStructuresState = SimplifiedStructureForAdmin[];

export const initialAllStructuresState: AllStructuresState = [];

export const allStructuresReducer = createReducer<
  AllStructuresState,
  AllStructuresActions
>(initialAllStructuresState, {
  SET_ALL_STRUCTURES: (state, action) => action.payload,
});
