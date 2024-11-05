import { GetStructureResponse } from "@refugies-info/api-types";
import { createSelector } from "reselect";
import { areDispositifsAssociesPopulate } from "../../types/typeGuards";
import { RootState } from "../rootReducer";

export const userStructureSelector = (state: RootState): GetStructureResponse | null => state.userStructure;

const selectUserStructureDisposAssociesSelector = (state: RootState) => state.userStructure?.dispositifsAssocies;

export const userStructureDisposAssociesSelector = createSelector(
  [selectUserStructureDisposAssociesSelector],
  (selectUserStructureDisposAssociesSelector) => {
    if (!selectUserStructureDisposAssociesSelector) return [];
    if (areDispositifsAssociesPopulate(selectUserStructureDisposAssociesSelector)) {
      return selectUserStructureDisposAssociesSelector;
    }
    return [];
  },
);

export const userStructureHasResponsibleSeenNotification = (state: RootState): boolean =>
  state.userStructure ? !!state.userStructure.hasResponsibleSeenNotification : false;

export const userStructureNameSelector = (state: RootState): string | null =>
  state.userStructure ? state.userStructure.nom : null;

export const userStructureMembresSelector = (state: RootState): GetStructureResponse["membres"] =>
  state.userStructure ? state.userStructure.membres : [];
