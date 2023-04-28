import {
  GetContentsForAppRequest,
  MobileFrenchLevel,
  frenchLevelType,
} from "@refugies-info/api-types";

export const ageFilters: {
  name: string;
  key: GetContentsForAppRequest["age"];
}[] = [
  { name: "age_10_17", key: "0 à 17 ans" },
  { name: "age_18_25", key: "18 à 25 ans" },
  { name: "age_26_100", key: "26 ans et plus" },
];

export const frenchLevelFilters: {
  name: string;
  cecrCorrespondency: frenchLevelType[];
  key: MobileFrenchLevel;
}[] = [
  {
    name: "french_level_0",
    cecrCorrespondency: ["alpha"],
    key: MobileFrenchLevel["Je ne lis et n'écris pas le français"],
  },
  {
    name: "french_level_a",
    cecrCorrespondency: ["A1", "A2"],
    key: MobileFrenchLevel["Je parle un peu"],
  },
  {
    name: "french_level_b",
    cecrCorrespondency: ["B1", "B2"],
    key: MobileFrenchLevel["Je parle bien"],
  },
  {
    name: "french_level_c",
    cecrCorrespondency: ["C1", "C2"],
    key: MobileFrenchLevel["Je parle couramment"],
  },
  {
    name: "no_french_level_filter",
    cecrCorrespondency: ["alpha", "A1", "A2", "B1", "B2", "C1", "C2"],
    key: MobileFrenchLevel["Tous les niveaux"],
  },
];
