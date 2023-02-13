import { createReducer } from "typesafe-actions";
import { SelectedDispositifActions } from "./selectedDispositif.actions";
import merge from "lodash/merge";
import { GetDispositifResponse } from "api-types";


export type SelectedDispositifState = GetDispositifResponse;

const initialSelectedDispositifState = null;

export const selectedDispositifReducer = createReducer<
  SelectedDispositifState | null,
  SelectedDispositifActions
>(initialSelectedDispositifState, {
  SET_SELECTED_DISPOSITIF: (state, action) => {
    return {
      ...(action.payload.reset ? {} : state),
      ...action.payload.value,
    }
  },
  UPDATE_SELECTED_DISPOSITIF: (state, action) =>
    merge({ ...state, ...action.payload }),
});
