import { RootState } from "../rootReducer";
import { Need } from "../../types/interface";
import { ObjectId } from "mongodb";

export const needsSelector = (state: RootState): Need[] => state.needs;

export const needSelector = (needId: ObjectId | null) => (state: RootState) => {
  if (!needId) return null;
  const filteredState = state.needs.filter((need) => need._id === needId);

  return filteredState.length > 0 ? filteredState[0] : null;
};
