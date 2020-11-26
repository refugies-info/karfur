import {
  SET_DISPOSITIFS,
  FETCH_DISPOSITIFS,
} from "./activeDispositifs.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { Dispositif } from "../../@types/interface";

export const setDispositifsActionsCreator = (value: Dispositif[]) =>
  action(SET_DISPOSITIFS, value);

export const fetchDispositifsActionCreator = () => action(FETCH_DISPOSITIFS);

const actions = {
  setDispositifsActionsCreator,
  fetchDispositifsActionCreator,
};

export type ActiveDispositifsActions = ActionType<typeof actions>;
