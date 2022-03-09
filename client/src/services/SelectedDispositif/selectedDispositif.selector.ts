import { RootState } from "../rootReducer";
import { SelectedDispositifState } from "services/SelectedDispositif/selectedDispositif.reducer";

export const selectedDispositifSelector = (state: RootState): SelectedDispositifState | null =>
  state.selectedDispositif;
