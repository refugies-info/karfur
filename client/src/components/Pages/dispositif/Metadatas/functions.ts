import { LinkProps } from "next/link";
import { conditionType, Metadatas } from "@refugies-info/api-types";
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
import imgDiploma from "assets/dispositif/form-icons/conditions-school.svg";
import { TFunction } from "next-i18next";

export const getPrice = (price: Metadatas["price"] | null | undefined, t: TFunction) => {
  if (!price) return price; // null or undefined
  return getPriceText(price, t);
}
export const getPublicStatus = (publicStatus: Metadatas["publicStatus"] | null | undefined, t: TFunction) => {
  if (!publicStatus) return publicStatus;
  return getPublicStatusText(publicStatus, t);
}
export const getAllPublicStatus = (t: TFunction) => {
  return getPublicStatusText([
    "apatride", "asile", "refugie", "subsidiaire", "temporaire", "french"
  ], t);
}
export const getPublic = (publicType: Metadatas["public"] | null | undefined, t: TFunction) => {
  if (!publicType) return publicType;
  return getPublicText(publicType, t);
}
export const getAge = (age: Metadatas["age"] | null | undefined, t: TFunction) => {
  if (!age) return age; // null or undefined
  return getAgeText(age, t);
}
export const getCommitment = (commitment: Metadatas["commitment"] | null | undefined, t: TFunction) => {
  if (!commitment) return commitment;
  return getCommitmentText(commitment, t);
}
export const getFrequency = (frequency: Metadatas["frequency"] | null | undefined, t: TFunction) => {
  if (!frequency) return frequency;
  return getFrequencyText(frequency, t);
}
export const getTimeSlots = (timeSlots: Metadatas["timeSlots"] | null | undefined, t: TFunction) => {
  if (!timeSlots) return timeSlots;
  return getTimeSlotsText(timeSlots, t);
}
export const getFrenchLevel = (frenchLevel: Metadatas["frenchLevel"], t: TFunction) => {
  if (!frenchLevel) return frenchLevel;
  return getFrenchLevelText(frenchLevel, t);
}
export const getAllFrenchLevel = (t: TFunction) => {
  return getFrenchLevelText(["alpha", "A1", "A2", "B1", "B2", "C1", "C2"], t);
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
    case "school":
      return imgDiploma;
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
