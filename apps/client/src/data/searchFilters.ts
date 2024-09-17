import type { publicStatusType, publicType } from "@refugies-info/api-types";

export type AgeOptions = "-18" | "18-25" | "+25";
export type FrenchOptions = "a" | "b" | "c";
export type SortOptions = "date" | "view" | "theme" | "location";
export type TypeOptions = "dispositif" | "demarche" | "all" | "ressource";
export type PublicOptions = publicType;
export type StatusOptions = publicStatusType;

export type AgeFilters = {
  key: AgeOptions;
  value: string;
  backwardCompatibility: string[];
}[];
export type FrenchFilters = {
  key: FrenchOptions;
  value: string;
  backwardCompatibility: string[];
}[];
export type SortFilters = {
  key: SortOptions;
  value: string;
  backwardCompatibility: string;
}[];
export type TypeFilters = {
  key: TypeOptions;
  value: string;
  backwardCompatibility: string;
}[];
export type PublicFilters = {
  key: PublicOptions;
  value: string;
}[];
export type StatusFilters = {
  key: StatusOptions;
  value: string;
}[];

export const ageFilters: AgeFilters = [
  { key: "-18", value: "Filters.age-18", backwardCompatibility: ["moins de 18 ans"] },
  { key: "18-25", value: "Filters.age18-25", backwardCompatibility: ["entre 18 et 25 ans"] },
  { key: "+25", value: "Filters.age+25", backwardCompatibility: ["entre 25 et 56 ans", "56 ans et plus"] },
];
export const frenchLevelFilter: FrenchFilters = [
  { key: "a", value: "Filters.frenchLevelA", backwardCompatibility: ["pas du tout", "un peu"] },
  { key: "b", value: "Filters.frenchLevelB", backwardCompatibility: ["moyennement"] },
  { key: "c", value: "Filters.frenchLevelC", backwardCompatibility: ["bien"] },
];
export const sortOptions: SortFilters = [
  { key: "location", value: "Filters.sortLocation", backwardCompatibility: "" },
  { key: "theme", value: "Filters.sortTheme", backwardCompatibility: "theme" },
  { key: "date", value: "Filters.sortDate", backwardCompatibility: "created_at" },
  { key: "view", value: "Filters.sortView", backwardCompatibility: "nbVues" },
];
export const filterType: TypeFilters = [
  { key: "all", value: "Filters.typeAll", backwardCompatibility: "" },
  { key: "dispositif", value: "Filters.typeDispositif", backwardCompatibility: "dispositifs" },
  { key: "demarche", value: "Filters.typeDemarche", backwardCompatibility: "demarches" },
  { key: "ressource", value: "Filters.typeRessource", backwardCompatibility: "ressources" },
];
export const publicOptions: PublicFilters = [
  { key: "family", value: "Infocards.family" },
  { key: "women", value: "Infocards.women" },
  { key: "youths", value: "Infocards.youths" },
  { key: "gender", value: "Infocards.gender" },
  { key: "senior", value: "Infocards.senior" },
];
export const statusOptions: StatusFilters = [
  { key: "asile", value: "Infocards.asile" },
  { key: "refugie", value: "Infocards.refugie" },
  { key: "subsidiaire", value: "Infocards.subsidiaire" },
  { key: "apatride", value: "Infocards.apatride" },
  { key: "temporaire", value: "Infocards.temporaire" },
  { key: "french", value: "Infocards.french" },
];
