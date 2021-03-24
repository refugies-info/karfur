import { RootState } from "../rootReducer";
import {
  UserStructure,
  IDispositif,
  UserStructureMembre,
} from "../../types/interface";
import { areDispositifsAssociesPopulate } from "../../types/typeGuards";

export const userStructureSelector = (state: RootState): UserStructure | null =>
  state.userStructure;

export const userStructureDisposAssociesSelector = (
  state: RootState
): IDispositif[] => {
  if (!state.userStructure) return [];
  if (areDispositifsAssociesPopulate(state.userStructure.dispositifsAssocies)) {
    return state.userStructure.dispositifsAssocies;
  }
  return [];
};

export const userStructureHasResponsibleSeenNotification = (
  state: RootState
): boolean =>
  state.userStructure
    ? !!state.userStructure.hasResponsibleSeenNotification
    : false;

export const userStructureNameSelector = (state: RootState): string | null =>
  state.userStructure ? state.userStructure.nom : null;

export const userStructureMembresSelector = (
  state: RootState
): UserStructureMembre[] =>
  state.userStructure ? state.userStructure.membres : [];
