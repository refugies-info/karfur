import { createReducer } from "typesafe-actions";
import { NeedsActions } from "./needs.actions";
import { GetNeedResponse } from "api-types";

export type NeedsState = GetNeedResponse[];

const initialNeedsState: NeedsState = [];

export const needsReducer = createReducer<NeedsState, NeedsActions>(
  initialNeedsState,
  {
    SET_NEEDS: (_, action) => action.payload,
  }
);
