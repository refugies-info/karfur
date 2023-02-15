import { RootState } from "../rootReducer";
import { GetDispositifsResponse } from "api-types";

export const activeDispositifsSelector = (state: RootState): GetDispositifsResponse[] =>
  state.activeDispositifs;
