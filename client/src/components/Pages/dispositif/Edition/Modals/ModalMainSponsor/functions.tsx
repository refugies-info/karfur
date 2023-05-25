import { Id, Sponsor } from "@refugies-info/api-types";
import { hasStructureTitles, noStructureTitles } from "./data";
import { ContactInfos } from "./ModalMainSponsor";

export const isStep = (currentStep: number, step: number | number[]) => {
  return typeof step === "number" ? currentStep === step : step.includes(currentStep);
};

export const getDisplayedStep = (step: number, hasStructure: boolean) => {
  if (hasStructure) {
    if (isStep(step, 4)) return 1;
    if (isStep(step, 5)) return 2;
    if (step) return 3;
  } else {
    if (isStep(step, 5)) return 1;
    if (isStep(step, 6)) return 2;
    if (isStep(step, [7, 9])) return 3;
    if (isStep(step, 11)) return 4;
  }
  return 0;
};
export const getDisplayedMaxStep = (step: number, hasStructure: boolean) => {
  if (hasStructure) {
    if (isStep(step, [0, 2])) return 0;
    if (isStep(step, [4, 5])) return 2;
    if (isStep(step, 7)) return 3;
  } else {
    if (isStep(step, 0)) return 0;
    if (isStep(step, [5, 6, 7, 9])) return 3;
    if (isStep(step, 11)) return 4;
  }
  return 0;
};
export const getPreviousStep = (step: number, hasStructure: boolean) => {
  if (hasStructure) {
    if (isStep(step, 2)) return 0;
    if (isStep(step, 4)) return 2;
    if (isStep(step, 7)) return 5;
  } else {
    if (isStep(step, [1, 5])) return 0;
    if (isStep(step, 4)) return 1;
    if (isStep(step, [7, 9])) return 6;
    if (isStep(step, 11)) return 9;
  }
  return step - 1;
};
export const getIsEndModal = (step: number, hasStructure: boolean) => {
  if (hasStructure) {
    return isStep(step, [3, 6, 8]);
  }
  return isStep(step, [3, 4, 8, 10, 12]);
};
export const getTextContent = (step: number, hasStructure: boolean) =>
  hasStructure ? hasStructureTitles[step] : noStructureTitles[step];

export const isNextButtonDisabled = (
  step: number,
  hasStructure: boolean,
  authorContact: ContactInfos,
  structureContact: ContactInfos,
  mainSponsor: Sponsor,
  memberOfStructure: boolean | null,
  selectedStructure: Id | null,
  otherStructure: boolean | null,
  createStructure: boolean | null,
  unknownContact: boolean | null,
) => {
  const isCreateForm = hasStructure ? isStep(step, 4) : isStep(step, 5);
  const isAuthorContactForm = hasStructure ? isStep(step, 7) : isStep(step, [2, 7, 11]);
  const isStructureContactForm = hasStructure ? isStep(step, 5) : isStep(step, 9);
  const isMemberOfStructureForm = hasStructure ? false : isStep(step, [1, 6]);
  const isChooseStructureForm = hasStructure ? isStep(step, 0) : false;
  const isSearchStructureForm = hasStructure ? isStep(step, 2) : isStep(step, 0);

  if (isCreateForm) {
    return !mainSponsor.name || !mainSponsor.link || !mainSponsor.logo.secure_url;
  } else if (isAuthorContactForm) {
    return !authorContact.name || !authorContact.email || !authorContact.phone;
  } else if (isStructureContactForm && !unknownContact) {
    return !structureContact.name;
  } else if (isMemberOfStructureForm) {
    return memberOfStructure === null;
  } else if (isChooseStructureForm) {
    return !selectedStructure && !otherStructure;
  } else if (isSearchStructureForm) {
    return !selectedStructure && !createStructure;
  }
  return false;
};
