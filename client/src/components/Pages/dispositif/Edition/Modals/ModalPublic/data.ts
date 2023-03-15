import { ageType, frenchLevelType, publicStatusType, publicType } from "api-types";

export const help = {
  title: "À quoi sert cette information ?",
  content: "Ajoutez-les seulement si ce sont vraiment des critères exluant le cas échéant.",
};

export const publicStatusOptions: Record<publicStatusType, string> = {
  asile: "Demandeurs d'asile",
  refugie: "Réfugiés statutaires",
  subsidiaire: "Bénéficiaires de la protection subsidiaire",
  apatride: "Apatrides",
  french: "Citoyens français",
};
export const publicOptions: Record<publicType, string> = {
  family: "Famille",
  women: "Femmes",
  youths: "Jeunes (de 16 à 25 ans)",
  senior: "Séniors",
};
export const frenchLevelOptions: Record<frenchLevelType, string> = {
  "A1.1": "en cours d'alphabétisation",
  "A1": "je découvre le français",
  "A2": "je comprends des messages simples",
  "B1": "je communique avec des francophones",
  "B2": "je communique avec aisance",
  "C1": "je communique avec grande aisance",
  "C2": "...",
};
export const ageOptions: Record<ageType, string> = {
  moreThan: "Plus de ** ans",
  between: "Entre ** et ** ans",
  lessThan: "Moins de ** ans",
};
