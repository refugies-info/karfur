import { GetNeedResponse } from "@refugies-info/api-types";
import { NeedsActions } from "./needs.actions";
import { createReducer } from "typesafe-actions";

export type NeedState = GetNeedResponse[];
export const initialNeedState = [];

export const needsReducer = createReducer<NeedState, NeedsActions>(
  initialNeedState,
  {
    SET_NEEDS: (_, action) => action.payload,
  }
);
