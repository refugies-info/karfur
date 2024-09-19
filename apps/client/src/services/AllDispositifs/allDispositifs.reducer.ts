import { GetAllDispositifsResponse } from "@refugies-info/api-types";
import { createReducer } from "typesafe-actions";
import { AllDispositifsActions } from "./allDispositifs.actions";

export type AllDispositifsState = GetAllDispositifsResponse[];

export const initialAllDispositifsState: AllDispositifsState = [];

export const allDispositifsReducer = createReducer<AllDispositifsState, AllDispositifsActions>(
  initialAllDispositifsState,
  {
    SET_ALL_DISPOSITIFS: (_, action) => action.payload,
  },
);
