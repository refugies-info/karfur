import { RootState } from "../reducers";
import { AvailableLanguageI18nCode } from "../../../types/interface";

export const selectedContentSelector = (
  langue: AvailableLanguageI18nCode | null
) => (state: RootState) => {
  if (!langue) return null;
  return state.selectedContent[langue];
};
