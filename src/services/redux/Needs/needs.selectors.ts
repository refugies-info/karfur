import { RootState } from "../reducers";
import { ObjectId } from "../../../types/interface";

export const needsSelector = (state: RootState) => state.needs;

export const needNameSelector = (id: ObjectId, locale: string | null) => (
  state: RootState
) => {
  if (!locale) return "";
  const filteredNeeds = state.needs.filter((need) => need._id === id);
  if (filteredNeeds.length > 0) {
    // @ts-ignore
    if (filteredNeeds[0][locale]) return filteredNeeds[0][locale].text;
    return filteredNeeds[0]["fr"].text;
  }
  return "";
};
