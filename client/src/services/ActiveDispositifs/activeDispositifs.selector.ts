import { RootState } from "../rootReducer";
import { IDispositif } from "../../types/interface";

export const activeDispositifsSelector = (state: RootState): IDispositif[] =>
  state.activeDispositifs;
