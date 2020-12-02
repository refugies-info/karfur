import {
  SET_ACTIVE_DISPOSITIFS,
  FETCH_ACTIVE_DISPOSITIFS,
} from "./activeDispositifs.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { Dispositif } from "../../@types/interface";

export const setActiveDispositifsActionsCreator = (value: Dispositif[]) =>
  action(SET_ACTIVE_DISPOSITIFS, value);

export const fetchActiveDispositifsActionsCreator = () =>
  action(FETCH_ACTIVE_DISPOSITIFS);

const actions = {
  setActiveDispositifsActionsCreator,
  fetchActiveDispositifsActionsCreator,
};

export type ActiveDispositifsActions = ActionType<typeof actions>;
