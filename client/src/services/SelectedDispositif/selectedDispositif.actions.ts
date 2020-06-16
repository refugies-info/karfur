import {
  FETCH_SELECTED_DISPOSITIF,
  SET_SELECTED_DISPOSITIF,
} from "./selectedDispositif.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Dispositif } from "../../@types/interface";

export const fetchSelectedDispositifActionCreator = (value: {
  selectedDispositifId: string;
  locale: string;
}) => action(FETCH_SELECTED_DISPOSITIF, value);

export const setSelectedDispositifActionCreator = (value: Dispositif) =>
  action(SET_SELECTED_DISPOSITIF, value);

const actions = {
  fetchSelectedDispositifActionCreator,
  setSelectedDispositifActionCreator,
};

export type SelectedDispositifActions = ActionType<typeof actions>;
