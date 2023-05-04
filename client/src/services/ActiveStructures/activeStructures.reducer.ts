import { createReducer } from "typesafe-actions";
import { StructuresActions } from "./activeStructures.actions";
import { GetActiveStructuresResponse } from "api-types";

export type ActiveStructuresState = GetActiveStructuresResponse[];

const initialActiveStructuresState: ActiveStructuresState = [];

export const activeStructuresReducer = createReducer<
  ActiveStructuresState,
  StructuresActions
>(initialActiveStructuresState, {
  SET_ACTIVE_STRUCTURES: (_, action) => action.payload,
});
