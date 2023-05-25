import { RootState } from "../rootReducer";
import { GetDispositifsResponse } from "@refugies-info/api-types";

export const activeDispositifsSelector = (state: RootState): GetDispositifsResponse[] =>
  state.activeDispositifs;
