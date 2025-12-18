import type { SimpleDispositif } from "@refugies-info/api-types";
import type { RootState } from "../rootReducer";

export const activeDispositifsSelector = (state: RootState): SimpleDispositif[] =>
  state.activeDispositifs ?? [];
