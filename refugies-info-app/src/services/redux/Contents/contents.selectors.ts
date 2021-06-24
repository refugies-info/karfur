import { RootState } from "../reducers";
import { AvailableLanguageI18nCode } from "../../../types/interface";

export const contentsSelector = (langue: AvailableLanguageI18nCode) => (
  state: RootState
) => state.contents[langue];
