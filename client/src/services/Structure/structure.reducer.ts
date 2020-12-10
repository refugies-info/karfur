import { updateObject } from "../utility";
import { createReducer } from "typesafe-actions";
import { StructureActions } from "./structure.actions";
import { Structure } from "../../@types/interface";

export interface StructureState {
  userStructure: Structure | null;
}
const initialStructureState: StructureState = {
  userStructure: null,
};

export const structureReducer = createReducer<StructureState, StructureActions>(
  initialStructureState,
  {
    SET_USER_STRUCTURE: (state, action) =>
      updateObject(state, { userStructure: action.payload }),
  }
);
