import { GetStructureResponse } from "api-types";
import { createReducer } from "typesafe-actions";
import { SelectedStructureActions } from "./selectedStructure.actions";

export type SelectedStructureState = GetStructureResponse | null;

const initialSelectedStructureState: SelectedStructureState = null;

export const selectedStructureReducer = createReducer<
  SelectedStructureState,
  SelectedStructureActions
>(initialSelectedStructureState, {
  SET_SELECTED_STRUCTURE: (_, action) => action.payload,
});
