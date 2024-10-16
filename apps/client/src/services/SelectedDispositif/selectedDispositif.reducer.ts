import { GetDispositifResponse } from "@refugies-info/api-types";
import merge from "lodash/merge";
import { createReducer } from "typesafe-actions";
import { SelectedDispositifActions } from "./selectedDispositif.actions";

export type SelectedDispositifState = GetDispositifResponse | null;

const initialSelectedDispositifState = null;

export const selectedDispositifReducer = createReducer<SelectedDispositifState | null, SelectedDispositifActions>(
  initialSelectedDispositifState,
  {
    SET_SELECTED_DISPOSITIF: (state, action) => {
      return {
        ...(action.payload.reset ? {} : state),
        ...action.payload.value,
      };
    },
    UPDATE_SELECTED_DISPOSITIF: (state, action) => merge({ ...state, ...action.payload }),
    CLEAR_SELECTED_DISPOSITIF: () => null,
  },
);
