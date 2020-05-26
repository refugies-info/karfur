import {
  SET_LANGUES,
  TOGGLE_LANG_MODAL,
  TOGGLE_LANGUE,
} from "../Langue/langue.actionTypes";
import API from "../../utils/API";
import { action, ActionType } from "typesafe-actions";
import { Language } from "../../@types/interface";

const setLanguesActionCreator = (value: Language[]) =>
  action(SET_LANGUES, value);

// TO DO saga
export const fetch_langues = () => {
  return (dispatch: any) => {
    return API.get_langues({}, { avancement: -1, langueFr: 1 }).then(
      (data: any) => {
        return dispatch(setLanguesActionCreator(data.data.data));
      }
    );
  };
};

export const toggleLangueModalActionCreator = () => action(TOGGLE_LANG_MODAL);
export const toggleLangueActionCreator = (value: string) =>
  action(TOGGLE_LANGUE, value);

const actions = {
  setLanguesActionCreator,
  toggleLangueModalActionCreator,
  toggleLangueActionCreator,
  fetch_langues,
};
export type LangueActions = ActionType<typeof actions>;
