import { RootState } from "../rootReducer";
import { IDispositif } from "../../types/interface";

export const activeIDispositifsSelector = (state: RootState): IDispositif[] =>
  state.activeDispositifs;
