import { RootState } from "../rootReducer";
import { SimplifiedDispositif } from "../../@types/interface";

export const allDispositifsSelector = (
  state: RootState
): SimplifiedDispositif[] => state.allDispositifs;
