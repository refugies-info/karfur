import { GetDispositifsResponse } from "@refugies-info/api-types";
import { RootState } from "../rootReducer";

export const activeDispositifsSelector = (state: RootState): GetDispositifsResponse[] => state.activeDispositifs;
