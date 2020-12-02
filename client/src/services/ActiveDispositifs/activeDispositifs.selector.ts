import { RootState } from "../rootReducer";
import { Dispositif } from "../../@types/interface";

export const activeDispositifsSelector = (state: RootState): Dispositif[] =>
  state.activeDispositifs;
