import { Need } from "../../../types/interface";
import { NeedsActions } from "./needs.actions";
import { createReducer } from "typesafe-actions";

export type NeedState = Need[];
export const initialNeedState = [];

export const needsReducer = createReducer<NeedState, NeedsActions>(
  initialNeedState,
  {
    SET_NEEDS: (_, action) => action.payload,
  }
);
