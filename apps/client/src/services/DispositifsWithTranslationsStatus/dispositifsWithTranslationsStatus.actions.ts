import { GetDispositifsWithTranslationAvancementResponse } from "@refugies-info/api-types";
import { ActionType, action } from "typesafe-actions";
import {
  FETCH_DISPOSITIFS_TRANSLATIONS_STATUS,
  SET_DISPOSITIFS_TRANSLATIONS_STATUS,
} from "./dispositifsWithTranslationsStatus.actionTypes";

export const fetchDispositifsWithTranslationsStatusActionCreator = (value: string) =>
  action(FETCH_DISPOSITIFS_TRANSLATIONS_STATUS, value);

export const setDispositifsWithTranslationsStatusActionCreator = (
  value: GetDispositifsWithTranslationAvancementResponse[],
) => action(SET_DISPOSITIFS_TRANSLATIONS_STATUS, value);

const actions = {
  fetchDispositifsWithTranslationsStatusActionCreator,
  setDispositifsWithTranslationsStatusActionCreator,
};

export type DispositifsWithTranslationsStatusActions = ActionType<typeof actions>;
