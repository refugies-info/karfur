import { createReducer } from "typesafe-actions";
import { GetDispositifsWithTranslationAvancementResponse } from "@refugies-info/api-types";
import { DispositifsWithTranslationsStatusActions } from "./dispositifsWithTranslationsStatus.actions";

export type DispositifsWithTranslationsStatusState = GetDispositifsWithTranslationAvancementResponse[];

const initialDispositifsWithTranslationsStatusState: DispositifsWithTranslationsStatusState = [];

export const dispositifsWithTranslationsStatusReducer = createReducer<
  DispositifsWithTranslationsStatusState,
  DispositifsWithTranslationsStatusActions
>(initialDispositifsWithTranslationsStatusState, {
  SET_DISPOSITIFS_TRANSLATIONS_STATUS: (_, action) => action.payload,
});
