import type { RootState } from "../rootReducer";
import type { DispositifsWithTranslationsStatusState } from "./dispositifsWithTranslationsStatus.reducer";

export const dispositifsWithTranslationsStatusSelector = (
  state: RootState,
): DispositifsWithTranslationsStatusState => state.dispositifsWithTranslations;
