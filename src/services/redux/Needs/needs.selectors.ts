import { RootState } from "../reducers";

export const needsSelector = (state: RootState) => state.needs;

export const needNameSelector =
  (id: string, locale: string | null) => (state: RootState) => {
    if (!locale) return "";
    const filteredNeeds = state.needs.filter(
      (need) => need._id.toString() === id
    );
    if (filteredNeeds.length > 0) {
      // @ts-ignore
      if (filteredNeeds[0][locale]) return filteredNeeds[0][locale].text;
      return filteredNeeds[0]["fr"].text;
    }
    return "";
  };
