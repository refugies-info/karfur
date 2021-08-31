import { RootState } from "../rootReducer";
import { Need } from "../../types/interface";

export const needsSelector = (state: RootState): Need[] => state.needs;
