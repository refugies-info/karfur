import {
  FETCH_USER_CONTRIBUTIONS,
  SET_USER_CONTRIBUTIONS,
  UPDATE_USER_CONTRIBUTIONS,
  DELETE_DISPOSITIF,
} from "./userContributions.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { ObjectId } from "mongodb";
import { GetUserContributionsResponse } from "api-types";

export const fetchUserContributionsActionCreator = () =>
  action(FETCH_USER_CONTRIBUTIONS);

export const setUserContributionsActionCreator = (value: GetUserContributionsResponse[]) =>
  action(SET_USER_CONTRIBUTIONS, value);

export const updateUserContributionsActionCreator = (value: {
  dispositifId?: ObjectId;
  type: "remove" | "remove-all";
  locale: string;
}) => action(UPDATE_USER_CONTRIBUTIONS, value);

export const deleteDispositifActionCreator = (value: ObjectId) =>
  action(DELETE_DISPOSITIF, value);

const actions = {
  fetchUserContributionsActionCreator,
  setUserContributionsActionCreator,
  updateUserContributionsActionCreator,
};

export type UserContributionsActions = ActionType<typeof actions>;
