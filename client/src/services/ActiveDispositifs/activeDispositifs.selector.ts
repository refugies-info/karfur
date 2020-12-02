import { RootState } from "../rootReducer";
import { Dispositif } from "../../@types/interface";

export const dispositifsSelector = (state: RootState): Dispositif[] =>
  state.activeDispositifs;
