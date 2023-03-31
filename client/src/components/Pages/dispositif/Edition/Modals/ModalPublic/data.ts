import { ageType, frenchLevelType, publicStatusType, publicType } from "api-types";

export const help = {
  title: "À quoi sert cette information ?",
  content: "Ajoutez-les seulement si ce sont vraiment des critères exluant le cas échéant.",
};

export const publicStatusOptions: Record<publicStatusType, string> = {
  asile: "Demandeurs d'asile",
  refugie: "Réfugiés statutaires",
  subsidiaire: "Bénéficiaires de la protection subsidiaire",
  temporaire: "Bénéficiaires de la protection temporaire",
  apatride: "Apatrides",
  french: "Citoyens français",
};
export const publicOptions: Record<publicType, string> = {
  family: "Famille",
  women: "Femmes",
  youths: "Jeunes (de 16 à 25 ans)",
  senior: "Séniors",
};
export type ChoiceItem = {
  text: string;
  help?: string;
}
export const frenchLevelOptions: Record<frenchLevelType, ChoiceItem> = {
  "A1.1": {
    text: "en cours d'alphabétisation",
  },
  "A1": {
    text: "je découvre le français",
    help: "Je peux comprendre et utiliser des expressions familières et quotidiennes avec des phrases très simples pour satisfaire des besoins concrets."
  },
  "A2": {
    text: "je comprends des messages simples",
    help: "Je peux comprendre des phrases isolées et des expressions en relation avec mon environnement immédiat : famille, travail, école. Je peux parler de sujets familiers."
  },
  "B1": {
    text: "je communique avec des francophones",
    help: "Je peux comprendre les points essentiels d’un message quand un langage clair et standard est utilisé. Je peux communiquer dans la plupart des situations rencontrées en voyage. Je peux raconter un événement, une expérience."
  },
  "B2": {
    text: "je communique avec aisance",
    help: "Je peux comprendre le contenu essentiel de messages complexes sur des sujets concrets ou abstraits. Je communique avec aisance avec un locuteur natif et je m'exprime de façon claire et détaillée sur une grande gamme de sujets."
  },
  "C1": {
    text: "je communique avec grande aisance",
    help: "Pratiquement aucune difficulté particulière."
  },
  "C2": {
    text: "...",
  },
};
export const ageOptions: Record<ageType, string> = {
  moreThan: "Plus de ** ans",
  between: "Entre ** et ** ans",
  lessThan: "Moins de ** ans",
};

export const modalTitles = [
  "À quel public s'adresse votre action ?",
  "Votre action est ouverte aux personnes de niveau(x) :",
  "Quel âge est demandé ?",
  "Votre action vise-t-elle un public spécifique ?",
]
