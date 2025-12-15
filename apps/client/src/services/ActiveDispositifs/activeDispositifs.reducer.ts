import type { SimpleDispositif } from "@refugies-info/api-types";
import { createReducer } from "typesafe-actions";
import type { ActiveDispositifsActions } from "./activeDispositifs.actions";

export type ActiveDispositifsState = SimpleDispositif[];

const initialActiveDispositifsState: ActiveDispositifsState = [];

export const activeDispositifsReducer = createReducer<
  ActiveDispositifsState,
  ActiveDispositifsActions
>(initialActiveDispositifsState, {
  SET_ACTIVE_DISPOSITIFS: (_, action) => action.payload,
});
