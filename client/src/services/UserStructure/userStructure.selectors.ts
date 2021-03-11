import { RootState } from "../rootReducer";
import { Structure, IDispositif } from "../../types/interface";
import { areDispositifsAssociesPopulate } from "../../types/typeGuards";

export const userStructureSelector = (state: RootState): Structure | null =>
  state.userStructure;

export const userStructureDisposAssocies = (
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
