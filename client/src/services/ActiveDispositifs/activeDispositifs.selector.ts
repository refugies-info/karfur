import { RootState } from "../rootReducer";
import { SearchDispositif } from "../../types/interface";

export const activeDispositifsSelector = (state: RootState): SearchDispositif[] =>
  state.activeDispositifs;
