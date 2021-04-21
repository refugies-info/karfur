import { RootState } from "../rootReducer";
import { DispositifsWithTranslationsStatusState } from "./dispositifsWithTranslationsStatus.reducer";

export const dispositifsWithTranslationsStatusSelector = (
  state: RootState
): DispositifsWithTranslationsStatusState => state.dispositifsWithTranslations;
