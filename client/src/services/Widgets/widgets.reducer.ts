import { createReducer } from "typesafe-actions";
import { WidgetsActions } from "./widgets.actions";
import { GetWidgetResponse } from "@refugies-info/api-types";

export type WidgetsState = GetWidgetResponse[];

const initialWidgetsState: WidgetsState = [];

export const widgetsReducer = createReducer<WidgetsState, WidgetsActions>(
  initialWidgetsState,
  {
    SET_WIDGETS: (_, action) => action.payload,
  }
);
