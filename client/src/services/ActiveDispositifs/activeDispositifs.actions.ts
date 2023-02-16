import {
  SET_ACTIVE_DISPOSITIFS,
  FETCH_ACTIVE_DISPOSITIFS,
  UPDATE_DISPOSITIF_REACTION,
} from "./activeDispositifs.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { ObjectId } from "mongodb";
import { GetDispositifsResponse, Id } from "api-types";

export const setActiveDispositifsActionsCreator = (value: GetDispositifsResponse[]) =>
  action(SET_ACTIVE_DISPOSITIFS, value);

export const fetchActiveDispositifsActionsCreator = () =>
  action(FETCH_ACTIVE_DISPOSITIFS);

export const updateDispositifReactionActionCreator = (value: {
  dispositif: {
    dispositifId: Id;
    suggestionId: string;
    fieldName: "suggestions" | "suggestions.$.read";
    type: "remove" | "read";
  };
  structureId: Id;
}) => action(UPDATE_DISPOSITIF_REACTION, value);

const actions = {
  setActiveDispositifsActionsCreator,
  fetchActiveDispositifsActionsCreator,
  updateDispositifReactionActionCreator,
};

export type ActiveDispositifsActions = ActionType<typeof actions>;
