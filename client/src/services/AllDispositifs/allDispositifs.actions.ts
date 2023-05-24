import {
  SET_ALL_DISPOSITIFS,
  FETCH_ALL_DISPOSITIFS,
} from "./allDispositifs.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { GetAllDispositifsResponse } from "@refugies-info/api-types";

export const setAllDispositifsActionsCreator = (
  value: GetAllDispositifsResponse[]
) => action(SET_ALL_DISPOSITIFS, value);

export const fetchAllDispositifsActionsCreator = () =>
  action(FETCH_ALL_DISPOSITIFS);

const actions = {
  setAllDispositifsActionsCreator,
  fetchAllDispositifsActionsCreator,
};

export type AllDispositifsActions = ActionType<typeof actions>;
