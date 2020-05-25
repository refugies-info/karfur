import { updateObject } from "../utility";
import { createReducer } from "typesafe-actions";
import { StructureActions } from "./structures.actions";
import { Structure } from "../../@types/interface";

export interface StructureState {
  structures: Structure[];
}
const initialStructureState: StructureState = {
  structures: [],
};

export const structureReducer = createReducer<StructureState, StructureActions>(
  initialStructureState,
  {
    SET_STRUCTURES: (state, action) =>
      updateObject(state, { structures: action.value }),
  }
);
