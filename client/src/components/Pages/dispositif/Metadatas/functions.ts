import qs from "query-string";
import { LinkProps } from "next/link";
import { conditionType, Metadatas } from "api-types";
import { getPath } from "routes";
import { AgeOptions, FrenchOptions } from "data/searchFilters";
import imgCb from "assets/dispositif/form-icons/conditions-cb.svg";
import imgDriver from "assets/dispositif/form-icons/conditions-driver.svg";
import imgOfpra from "assets/dispositif/form-icons/conditions-ofpra.svg";
import imgPoleEmploi from "assets/dispositif/form-icons/conditions-pole-emploi.svg";
import imgTse from "assets/dispositif/form-icons/conditions-tse.svg";
import imgOfii from "assets/dispositif/form-icons/conditions-ofii.svg";

export const getPrice = (price: Metadatas["price"] | null | undefined) => {
  // TODO: translate
  if (!price) return price; // null or undefined
  if (price.values?.[0] === 0) return "Gratuit";
  if (price.values.length === 0) return "Montant libre";
  if (price.values.length === 2) return `entre ${price.values[0]}€ et ${price.values[1]}€ ${price.details || ""}`;
  return `${price.values[0]}€ ${price.details || ""}`;
}

export const getAge = (age: Metadatas["age"] | null | undefined) => {
  if (!age) return age; // null or undefined
  switch (age.type) {
    case "lessThan":
      return `Moins de ${age.ages[0]} ans`;
    case "moreThan":
      return `Plus de ${age.ages[0]} ans`;
    case "between":
      return `Entre ${age.ages[0]} et ${age.ages[1]} ans`;
  }
}

export const getCommitment = (commitment: Metadatas["commitment"] | null | undefined) => {
  if (!commitment) return commitment;
  // TODO : translate
  return `${commitment.amountDetails} ${commitment.hours} ${commitment.timeUnit}`;
}
export const getFrequency = (frequency: Metadatas["frequency"] | null | undefined) => {
  if (!frequency) return frequency;
  // TODO : translate
  return `${frequency.amountDetails} ${frequency.hours} ${frequency.timeUnit} par ${frequency.frequencyUnit}`;
}
export const getTimeSlots = (timeSlots: Metadatas["timeSlots"] | null | undefined) => {
  if (!timeSlots) return timeSlots;
  // TODO : translate
  return timeSlots.join(", ");
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
    query: { departments: department.split(" - ")[1] },
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
    search: qs.stringify({ age: options }, { arrayFormat: "comma" }),
  }
}
export const getFrenchLevelLink = (frenchLevel: Metadatas["frenchLevel"]): LinkProps["href"] => {
  const options: FrenchOptions[] = [];
  if (frenchLevel) {
    if (frenchLevel.includes("A1") || frenchLevel.includes("A2")) options.push("a");
    if (frenchLevel.includes("B1") || frenchLevel.includes("B2")) options.push("b");
    if (frenchLevel.includes("C1") || frenchLevel.includes("C2")) options.push("c");
  }
  return {
    pathname: getPath("/recherche", "fr"),
    query: qs.stringify({ frenchLevel: options }, { arrayFormat: "comma" }),
  }
}
