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
  { key: "-18", value: "Moins de 18 ans" },
  { key: "18-25", value: "Entre 18 et 25 ans" },
  { key: "+25", value: "Plus de 25 ans" }
];
export const frenchLevelFilter: FrenchFilters = [
  { key: "a", value: "Débutant A1/A2" },
  { key: "b", value: "Intermédiaire B1/B2" },
  { key: "c", value: "Avancé C1/C2" }
];
export const sortOptions: SortFilters = [
  { key: "theme", value: "Par thématique" },
  { key: "date", value: "Les plus récentes" },
  { key: "view", value: "Les plus vues" }
];
export const filterType: TypeFilters = [
  { key: "all", value: "Tout" },
  { key: "dispositif", value: "Fiches dispositifs" },
  { key: "demarche", value: "Fiches demarches" },
];
