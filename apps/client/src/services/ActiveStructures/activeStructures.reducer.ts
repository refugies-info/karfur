import { GetActiveStructuresResponse } from "@refugies-info/api-types";
import { createReducer } from "typesafe-actions";
import { StructuresActions } from "./activeStructures.actions";

export type ActiveStructuresState = GetActiveStructuresResponse[];

const initialActiveStructuresState: ActiveStructuresState = [];

export const activeStructuresReducer = createReducer<ActiveStructuresState, StructuresActions>(
  initialActiveStructuresState,
  {
    SET_ACTIVE_STRUCTURES: (_, action) => action.payload,
  },
);
