import {
  FETCH_SELECTED_DISPOSITIF,
  SET_SELECTED_DISPOSITIF,
  UPDATE_SELECTED_DISPOSITIF,
} from "./selectedDispositif.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { GetDispositifResponse } from "api-types";

export const fetchSelectedDispositifActionCreator = (value: {
  selectedDispositifId: string;
  locale: string;
  token?: string;
}) => action(FETCH_SELECTED_DISPOSITIF, value);

export const setSelectedDispositifActionCreator = (
  value: GetDispositifResponse,
  reset: boolean = false,
) =>
  action(SET_SELECTED_DISPOSITIF, { value, reset });

export const updateSelectedDispositifActionCreator = (
  value: Partial<GetDispositifResponse>
) => action(UPDATE_SELECTED_DISPOSITIF, value);

const actions = {
  fetchSelectedDispositifActionCreator,
  setSelectedDispositifActionCreator,
  updateSelectedDispositifActionCreator,
};

export type SelectedDispositifActions = ActionType<typeof actions>;
