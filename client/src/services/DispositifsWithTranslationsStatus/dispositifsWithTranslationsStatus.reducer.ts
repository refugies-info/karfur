import { createReducer } from "typesafe-actions";
import { IDispositifTranslation } from "../../types/interface";
import { DispositifsWithTranslationsStatusActions } from "./dispositifsWithTranslationsStatus.actions";

export type DispositifsWithTranslationsStatusState = IDispositifTranslation[];

const initialDispositifsWithTranslationsStatusState: DispositifsWithTranslationsStatusState = [];

export const dispositifsWithTranslationsStatusReducer = createReducer<
  DispositifsWithTranslationsStatusState,
  DispositifsWithTranslationsStatusActions
>(initialDispositifsWithTranslationsStatusState, {
  SET_DISPOSITIFS_TRANSLATIONS_STATUS: (_, action) => action.payload,
});
