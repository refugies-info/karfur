import { createReducer } from "typesafe-actions";
import { AllStructuresActions } from "./allStructures.actions";
import { GetAllStructuresResponse } from "api-types";

export type AllStructuresState = GetAllStructuresResponse[];

export const initialAllStructuresState: AllStructuresState = [];

export const allStructuresReducer = createReducer<
  AllStructuresState,
  AllStructuresActions
>(initialAllStructuresState, {
  SET_ALL_STRUCTURES: (_, action) => action.payload,
});
