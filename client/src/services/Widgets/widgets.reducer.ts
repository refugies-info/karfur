import { createReducer } from "typesafe-actions";
import { Widget } from "types/interface";
import { WidgetsActions } from "./widgets.actions";

export type WidgetsState = Widget[];

const initialWidgetsState: WidgetsState = [];

export const widgetsReducer = createReducer<WidgetsState, WidgetsActions>(
  initialWidgetsState,
  {
    SET_WIDGETS: (_, action) => action.payload,
  }
);
