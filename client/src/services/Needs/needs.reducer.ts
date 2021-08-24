import { createReducer } from "typesafe-actions";
import { Need } from "../../types/interface";
import { NeedsActions } from "./needs.actions";

export type NeedsState = Need[];

const initialNeedsState: NeedsState = [];

export const needsReducer = createReducer<NeedsState, NeedsActions>(
  initialNeedsState,
  {
    SET_NEEDS: (_, action) => action.payload,
  }
);
