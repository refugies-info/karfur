import {
  SET_ALL_DISPOSITIFS,
  FETCH_ALL_DISPOSITIFS,
} from "./allDispositifs.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { Dispositif } from "../../@types/interface";

export const setAllDispositifsActionsCreator = (value: Dispositif[]) =>
  action(SET_ALL_DISPOSITIFS, value);

export const fetchAllDispositifsActionsCreator = () =>
  action(FETCH_ALL_DISPOSITIFS);

const actions = {
  setAllDispositifsActionsCreator,
  fetchAllDispositifsActionsCreator,
};

export type AllDispositifsActions = ActionType<typeof actions>;
