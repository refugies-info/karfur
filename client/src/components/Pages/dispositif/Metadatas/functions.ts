import { LinkProps } from "next/link";
import { conditionType, Metadatas } from "api-types";
import { getPath } from "routes";
import { buildUrlQuery } from "lib/recherche/buildUrlQuery";
import { getAgeText, getCommitmentText, getFrenchLevelText, getFrequencyText, getPriceText, getPublicStatusText, getPublicText, getTimeSlotsText } from "lib/dispositif";
import { AgeOptions, FrenchOptions } from "data/searchFilters";
import imgCb from "assets/dispositif/form-icons/conditions-cb.svg";
import imgDriver from "assets/dispositif/form-icons/conditions-driver.svg";
import imgOfpra from "assets/dispositif/form-icons/conditions-ofpra.svg";
import imgPoleEmploi from "assets/dispositif/form-icons/conditions-pole-emploi.svg";
import imgTse from "assets/dispositif/form-icons/conditions-tse.svg";
import imgOfii from "assets/dispositif/form-icons/conditions-ofii.svg";

export const getPrice = (price: Metadatas["price"] | null | undefined) => {
  if (!price) return price; // null or undefined
  return getPriceText(price);
}
export const getPublicStatus = (publicStatus: Metadatas["publicStatus"] | null | undefined) => {
  if (!publicStatus) return publicStatus;
  return getPublicStatusText(publicStatus);
}
export const getAllPublicStatus = () => {
  return getPublicStatusText([
    "apatride", "asile", "refugie", "subsidiaire", "temporaire", "french"
  ]);
}
export const getPublic = (publicType: Metadatas["public"] | null | undefined) => {
  if (!publicType) return publicType;
  return getPublicText(publicType);
}
export const getAge = (age: Metadatas["age"] | null | undefined) => {
  if (!age) return age; // null or undefined
  return getAgeText(age);
}
export const getCommitment = (commitment: Metadatas["commitment"] | null | undefined) => {
  if (!commitment) return commitment;
  return getCommitmentText(commitment);
}
export const getFrequency = (frequency: Metadatas["frequency"] | null | undefined) => {
  if (!frequency) return frequency;
  return getFrequencyText(frequency);
}
export const getTimeSlots = (timeSlots: Metadatas["timeSlots"] | null | undefined) => {
  if (!timeSlots) return timeSlots;
  return getTimeSlotsText(timeSlots);
}
export const getFrenchLevel = (frenchLevel: Metadatas["frenchLevel"]) => {
  if (!frenchLevel) return frenchLevel;
  return getFrenchLevelText(frenchLevel);
}
export const getAllFrenchLevel = () => {
  return getFrenchLevelText(["alpha", "A1", "A2", "B1", "B2", "C1", "C2"]);
}

export const getConditionImage = (condition: conditionType) => {
  switch (condition) {
    case "acte naissance":
      return imgOfpra;
    case "titre sejour":
      return imgTse;
    case "cir":
      return imgOfii;
    case "bank account":
      return imgCb;
    case "pole emploi":
      return imgPoleEmploi;
    case "driver license":
      return imgDriver;
    default:
      return null;
  }
}

export const getSponsorLink = (sponsorId: string | undefined): LinkProps["href"] => {
  if (!sponsorId) return "#";
  return {
    pathname: getPath("/annuaire/[id]", "fr"),
    query: { id: sponsorId },
  }
}

export const getLocationLink = (department: string): LinkProps["href"] => {
  return {
    pathname: getPath("/recherche", "fr"),
    search: buildUrlQuery({ departments: [department.split(" - ")[1]] }),
  }
}
export const getAgeLink = (age: Metadatas["age"]): LinkProps["href"] => {
  const options: AgeOptions[] = [];
  // TODO: validate rules
  if (age) {
    if (age.ages[0] < 18) options.push("-18");
    if ((age.ages[0] > 18 && age.ages[0] < 25) || (age.ages[1] > 18)) options.push("18-25");
    if (age.ages[0] >= 25 || age.ages[1] > 25) options.push("+25");
  }
  return {
    pathname: getPath("/recherche", "fr"),
    search: buildUrlQuery({ age: options }),
  }
}
export const getFrenchLevelLink = (frenchLevel: Metadatas["frenchLevel"]): LinkProps["href"] => {
  const options: FrenchOptions[] = [];
  if (frenchLevel) {
    if (frenchLevel.includes("alpha") || frenchLevel.includes("A1") || frenchLevel.includes("A2")) options.push("a");
    if (frenchLevel.includes("B1") || frenchLevel.includes("B2")) options.push("b");
    if (frenchLevel.includes("C1") || frenchLevel.includes("C2")) options.push("c");
  }
  return {
    pathname: getPath("/recherche", "fr"),
    search: buildUrlQuery({ frenchLevel: options }),
  }
}
