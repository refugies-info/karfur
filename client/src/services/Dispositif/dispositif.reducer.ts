import { updateObject } from "../utility";
import { Dispositif } from "../../@types/interface";
import { createReducer } from "typesafe-actions";
import { DispositifActions } from "./dispositif.actions";

export interface DispositifState {
  dispositifs: Dispositif[];
}
const initialDispositifState: DispositifState = {
  dispositifs: [],
};

export const dispositifReducer = createReducer<
  DispositifState,
  DispositifActions
>(initialDispositifState, {
  SET_DISPOSITIFS: (state, action) =>
    updateObject(state, { dispositifs: action.payload }),
});
