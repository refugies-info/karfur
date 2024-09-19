import { GetStructureDispositifResponse, GetStructureResponse } from "@refugies-info/api-types";
import { areDispositifsAssociesPopulate } from "../../types/typeGuards";
import { RootState } from "../rootReducer";

export const userStructureSelector = (state: RootState): GetStructureResponse | null => state.userStructure;

export const userStructureDisposAssociesSelector = (state: RootState): GetStructureDispositifResponse[] => {
  if (!state.userStructure) return [];
  if (areDispositifsAssociesPopulate(state.userStructure.dispositifsAssocies)) {
    return state.userStructure.dispositifsAssocies;
  }
  return [];
};

export const userStructureHasResponsibleSeenNotification = (state: RootState): boolean =>
  state.userStructure ? !!state.userStructure.hasResponsibleSeenNotification : false;

export const userStructureNameSelector = (state: RootState): string | null =>
  state.userStructure ? state.userStructure.nom : null;

export const userStructureMembresSelector = (state: RootState): GetStructureResponse["membres"] =>
  state.userStructure ? state.userStructure.membres : [];
