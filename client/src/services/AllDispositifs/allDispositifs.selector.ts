import { RootState } from "../rootReducer";
import { Dispositif } from "../../@types/interface";

export const allDispositifsSelector = (state: RootState): Dispositif[] =>
  state.allDispositifs;
