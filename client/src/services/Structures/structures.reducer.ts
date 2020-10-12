import { updateObject } from "../utility";
import { createReducer } from "typesafe-actions";
import { StructureActions } from "./structures.actions";
import { Structure } from "../../@types/interface";

export interface StructureState {
  structures: Structure[];
  userStructure: Structure | null;
}
const initialStructureState: StructureState = {
  structures: [],
  userStructure: null,
};

export const structureReducer = createReducer<StructureState, StructureActions>(
  initialStructureState,
  {
    SET_STRUCTURES: (state, action) =>
      updateObject(state, { structures: action.payload }),
    SET_USER_STRUCTURE: (state, action) =>
      updateObject(state, { userStructure: action.payload }),
  }
);
