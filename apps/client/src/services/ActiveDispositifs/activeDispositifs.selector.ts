import { SimpleDispositif } from "@refugies-info/api-types";
import { RootState } from "../rootReducer";

export const activeDispositifsSelector = (state: RootState): SimpleDispositif[] => state.activeDispositifs ?? [];
