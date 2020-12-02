import { createReducer } from "typesafe-actions";
import { Structure } from "../../@types/interface";
import { SelectedStructureActions } from "./selectedStructure.actions";

export type SelectedStructureState = Structure | null;

const initialSelectedStructureState: SelectedStructureState = null;

export const selectedStructureReducer = createReducer<
  SelectedStructureState,
  SelectedStructureActions
>(initialSelectedStructureState, {
  SET_SELECTED_STRUCTURE: (state, action) => action.payload,
});
