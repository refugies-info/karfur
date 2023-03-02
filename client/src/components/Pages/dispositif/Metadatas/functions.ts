import qs from "query-string";
import { LinkProps } from "next/link";
import { GetDispositifResponse, Metadatas } from "api-types";
import { getPath } from "routes";
import { AgeOptions, FrenchOptions } from "data/searchFilters";

export const getPrice = (price: GetDispositifResponse["metadatas"]["price"] | undefined) => {
  if (!price) return undefined;
  if (price.value === 0) return "Gratuit";
  return `${price.value}€ ${price.details}`;
}

export const getAge = (age: GetDispositifResponse["metadatas"]["age"] | undefined) => {
  if (!age) return undefined;
  switch (age.type) {
    case "lessThan":
      return `Moins de ${age.ages[0]} ans`;
    case "moreThan":
      return `Plus de ${age.ages[0]} ans`;
    case "between":
      return `Entre ${age.ages[0]} et ${age.ages[1]} ans`;
  }
}

export const getPublic = (publicType: GetDispositifResponse["metadatas"]["public"] | undefined) => {
  if (!publicType) return undefined;
  return publicType === "refugee" ? "Réfugiés" : "Tout le monde";
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
