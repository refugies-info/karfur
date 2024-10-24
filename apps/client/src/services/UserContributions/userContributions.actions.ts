import { GetUserContributionsResponse, Id } from "@refugies-info/api-types";
import { ActionType, action } from "typesafe-actions";
import {
  DELETE_DISPOSITIF,
  FETCH_USER_CONTRIBUTIONS,
  SET_USER_CONTRIBUTIONS,
  UPDATE_USER_CONTRIBUTIONS,
} from "./userContributions.actionTypes";

export const fetchUserContributionsActionCreator = () => action(FETCH_USER_CONTRIBUTIONS);

export const setUserContributionsActionCreator = (value: GetUserContributionsResponse[]) =>
  action(SET_USER_CONTRIBUTIONS, value);

export const updateUserContributionsActionCreator = (value: {
  dispositifId?: Id;
  type: "remove" | "remove-all";
  locale: string;
}) => action(UPDATE_USER_CONTRIBUTIONS, value);

export const deleteDispositifActionCreator = (value: Id) => action(DELETE_DISPOSITIF, value);

const actions = {
  fetchUserContributionsActionCreator,
  setUserContributionsActionCreator,
  updateUserContributionsActionCreator,
};

export type UserContributionsActions = ActionType<typeof actions>;
