import {
  FETCH_TRANSLATIONS,
  ADD_TRAD_DISP,
  UPDATE_TRAD,
  VALIDATE_TRAD,
  SET_TRANSLATION,
  SET_TRANSLATIONS,
} from "../Translation/translation.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { Translation } from "../../@types/interface";

export const fetchTranslationsActionCreator = (
  itemId: string,
  locale: string
) => action(FETCH_TRANSLATIONS, { itemId, locale });

export const validateTradActionCreator = (value: Translation) =>
  action(VALIDATE_TRAD, value);

export const updateTradActionCreator = (value: Translation) =>
  action(UPDATE_TRAD, value);

export const addTradActionCreator = (value: Translation) =>
  action(ADD_TRAD_DISP, value);

export const setTranslationActionCreator = (value: Translation) =>
  action(SET_TRANSLATION, value);

export const setTranslationsActionCreator = (value: Translation[]) =>
  action(SET_TRANSLATIONS, value);

const actions = {
  fetchTranslationsActionCreator,
  validateTradActionCreator,
  updateTradActionCreator,
  setTranslationActionCreator,
  setTranslationsActionCreator,
};

export type TranslationActions = ActionType<typeof actions>;
