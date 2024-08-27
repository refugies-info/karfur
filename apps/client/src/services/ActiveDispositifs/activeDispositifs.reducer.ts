import { GetDispositifsResponse } from "@refugies-info/api-types";
import { createReducer } from "typesafe-actions";
import { ActiveDispositifsActions } from "./activeDispositifs.actions";

export type ActiveDispositifsState = GetDispositifsResponse[];

const initialActiveDispositifsState: ActiveDispositifsState = [];

export const activeDispositifsReducer = createReducer<ActiveDispositifsState, ActiveDispositifsActions>(
  initialActiveDispositifsState,
  {
    SET_ACTIVE_DISPOSITIFS: (_, action) => action.payload,
  },
);
