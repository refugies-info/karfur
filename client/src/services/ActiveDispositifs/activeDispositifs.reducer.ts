import { SearchDispositif } from "../../types/interface";
import { createReducer } from "typesafe-actions";
import { ActiveDispositifsActions } from "./activeDispositifs.actions";

export type ActiveDispositifsState = SearchDispositif[];

const initialActiveDispositifsState: ActiveDispositifsState = [];

export const activeDispositifsReducer = createReducer<
  ActiveDispositifsState,
  ActiveDispositifsActions
>(initialActiveDispositifsState, {
  SET_ACTIVE_DISPOSITIFS: (_, action) => action.payload,
});
