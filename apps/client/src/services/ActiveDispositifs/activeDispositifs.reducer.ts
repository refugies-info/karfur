import { createReducer } from "typesafe-actions";
import { ActiveDispositifsActions } from "./activeDispositifs.actions";
import { GetDispositifsResponse } from "@refugies-info/api-types";

export type ActiveDispositifsState = GetDispositifsResponse[];

const initialActiveDispositifsState: ActiveDispositifsState = [];

export const activeDispositifsReducer = createReducer<
  ActiveDispositifsState,
  ActiveDispositifsActions
>(initialActiveDispositifsState, {
  SET_ACTIVE_DISPOSITIFS: (_, action) => action.payload,
});
