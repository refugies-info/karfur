import { GetDispositifsResponse, Id } from "@refugies-info/api-types";
import { ActionType, action } from "typesafe-actions";
import {
  FETCH_ACTIVE_DISPOSITIFS,
  SET_ACTIVE_DISPOSITIFS,
  UPDATE_DISPOSITIF_REACTION,
} from "./activeDispositifs.actionTypes";

export const setActiveDispositifsActionsCreator = (value: GetDispositifsResponse[]) =>
  action(SET_ACTIVE_DISPOSITIFS, value);

export const fetchActiveDispositifsActionsCreator = () => action(FETCH_ACTIVE_DISPOSITIFS);

export const updateDispositifReactionActionCreator = (value: {
  suggestion: {
    dispositifId: Id;
    suggestionId: string;
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
