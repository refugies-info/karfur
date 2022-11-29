export type AgeOptions = "-18" | "18-25" | "+25";
export type FrenchOptions = "a" | "b" | "c";
export type SortOptions = "date" | "view" | "theme";
export type TypeOptions = "dispositif" | "demarche" | "all";

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

export const ageFilters: AgeFilters = [
  { key: "-18", value: "Filters.age-18", backwardCompatibility: ["moins de 18 ans"] },
  { key: "18-25", value: "Filters.age18-25", backwardCompatibility: ["entre 18 et 25 ans"] },
  { key: "+25", value: "Filters.age+25", backwardCompatibility: ["entre 25 et 56 ans", "56 ans et plus"] }
];
export const frenchLevelFilter: FrenchFilters = [
  { key: "a", value: "Filters.frenchLevelA", backwardCompatibility: ["pas du tout", "un peu"] },
  { key: "b", value: "Filters.frenchLevelB", backwardCompatibility: ["moyennement"] },
  { key: "c", value: "Filters.frenchLevelC", backwardCompatibility: ["bien"] }
];
export const sortOptions: SortFilters = [
  { key: "theme", value: "Filters.sortTheme", backwardCompatibility: "theme" },
  { key: "date", value: "Filters.sortDate", backwardCompatibility: "created_at" },
  { key: "view", value: "Filters.sortView", backwardCompatibility: "nbVues" },
];
export const filterType: TypeFilters = [
  { key: "all", value: "Filters.typeAll", backwardCompatibility: "" },
  { key: "dispositif", value: "Filters.typeDispositif", backwardCompatibility: "dispositifs" },
  { key: "demarche", value: "Filters.typeDemarche", backwardCompatibility: "demarches" },
];
