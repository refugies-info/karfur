import { Tag } from "types/interface";
import { tags } from "./tags";

// FILTERS
export type AvailableFilters = "theme" | "age" | "frenchLevel" | "loc" | "langue";
export type AgeFilter = {
  name: "moins de 18 ans" | "entre 18 et 25 ans" | "entre 25 et 56 ans" | "56 ans et plus";
  bottomValue: number;
  topValue: number;
}
export type FrenchLevelFilter = {
  name: "pas du tout" | "un peu" | "moyennement" | "bien";
  query: string[]
}
export type SearchItemType = {
  title: string
  type: AvailableFilters;
  placeholder: string
  children?: Tag[] | AgeFilter[] | FrenchLevelFilter[];
  title2?: string
  append?: string
}

export const searchTheme: SearchItemType = {
  title: "J'ai besoin de",
  placeholder: "thème",
  type: "theme",
  children: tags,
};
export const searchLoc: SearchItemType = {
  title: "J'habite à",
  type: "loc",
  placeholder: "ma ville",
};
export const searchAge: SearchItemType = {
  title: "J'ai",
  type: "age",
  placeholder: "âge",
  children: [
    {
      name: "moins de 18 ans",
      bottomValue: -1,
      topValue: 18,
    },
    {
      name: "entre 18 et 25 ans",
      bottomValue: 18,
      topValue: 25,
    },
    {
      name: "entre 25 et 56 ans",
      bottomValue: 25,
      topValue: 56,
    },
    {
      name: "56 ans et plus",
      bottomValue: 56,
      topValue: 120,
    },
  ],
};
export const searchFrench: SearchItemType = {
  title: "Je parle",
  type: "frenchLevel",
  placeholder: "niveau de français",
  title2: "français",
  append: "Quel est mon niveau ?",
  children: [
    {
      name: "pas du tout",
      query: ["Débutant", "Intermédiaire", "Avancé"],
    },
    {
      name: "un peu",
      query: ["Intermédiaire", "Avancé"],
    },
    {
      name: "moyennement",
      query: ["Avancé"],
    },
    {
      name: "bien",
      query: [],
    },
  ],
};

// TYPES
export type Filtres = {
  name: "Dispositifs" | "Démarches";
  value: "dispositifs" | "demarches";
}
export const filtres_contenu: Filtres[] = [
  {
    name: "Dispositifs",
    value: "dispositifs"
  },
  {
    name: "Démarches",
    value: "demarches"
  },
];

// SORT
export type Tris = {
  name: "Derniers ajouts" | "Les plus visités" | "Par thème";
  value: "created_at" | "nbVues" | "theme";
}
export const tris: Tris[] = [
  { name: "Derniers ajouts", value: "created_at" },
  { name: "Les plus visités", value: "nbVues" },
  { name: "Par thème", value: "theme" },
];
