export type AgeOptions = "-18" | "18-25" | "+25";
export type FrenchOptions = "a" | "b" | "c";
export type SortOptions = "date" | "view" | "theme";
export type TypeOptions = "dispositif" | "demarche" | "all";

export type AgeFilters = {
  key: AgeOptions;
  value: string;
}[];
export type FrenchFilters = {
  key: FrenchOptions;
  value: string;
}[];
export type SortFilters = {
  key: SortOptions;
  value: string;
}[];
export type TypeFilters = {
  key: TypeOptions;
  value: string;
}[];

export const ageFilters: AgeFilters = [
  { key: "-18", value: "Filters.age-18" },
  { key: "18-25", value: "Filters.age18-25" },
  { key: "+25", value: "Filters.age+25" }
];
export const frenchLevelFilter: FrenchFilters = [
  { key: "a", value: "Filters.frenchLevelA" },
  { key: "b", value: "Filters.frenchLevelB" },
  { key: "c", value: "Filters.frenchLevelC" }
];
export const sortOptions: SortFilters = [
  { key: "theme", value: "Filters.sortTheme" },
  { key: "date", value: "Filters.sortDate" },
  { key: "view", value: "Filters.sortView" },
];
export const filterType: TypeFilters = [
  { key: "all", value: "Filters.typeAll" },
  { key: "dispositif", value: "Filters.typeDispositif" },
  { key: "demarche", value: "Filters.typeDemarche" },
];
