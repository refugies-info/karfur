import { ageType, frenchLevelType, publicStatusType, publicType } from "api-types";
import React from "react";

export const help = {
  title: "À quoi sert cette information ?",
  content: "Ajoutez-les seulement si ce sont vraiment des critères exluant le cas échéant.",
};

export const publicStatusOptions: publicStatusType[] = [
  "asile",
  "refugie",
  "subsidiaire",
  "temporaire",
  "apatride",
  "french",
];
export const publicOptions: publicType[] = ["family", "women", "youths", "senior", "gender"];
export type ChoiceItem = {
  text: React.ReactNode;
  help?: string;
};
export const frenchLevelOptions: Record<frenchLevelType, ChoiceItem> = {
  alpha: {
    text: (
      <>
        <strong>Alphabétisation :</strong> en cours d'alphabétisation
      </>
    ),
  },
  A1: {
    text: (
      <>
        <strong>A1.1 et A1 :</strong> découverte du français
      </>
    ),
    help: "Je peux comprendre et utiliser des expressions familières et quotidiennes avec des phrases très simples pour satisfaire des besoins concrets.",
  },
  A2: {
    text: (
      <>
        <strong>A2 :</strong> communication de manière simple
      </>
    ),
    help: "Je peux comprendre des phrases isolées et des expressions en relation avec mon environnement immédiat : famille, travail, école. Je peux parler de sujets familiers.",
  },
  B1: {
    text: (
      <>
        <strong>B1 :</strong> utilisation d’un niveau de français intermédiaire
      </>
    ),
    help: "Je peux comprendre les points essentiels d’un message quand un langage clair et standard est utilisé. Je peux communiquer dans la plupart des situations rencontrées en voyage. Je peux raconter un événement, une expérience.",
  },
  B2: {
    text: (
      <>
        <strong>B2 :</strong> communication avec aisance
      </>
    ),
    help: "Je peux comprendre le contenu essentiel de messages complexes sur des sujets concrets ou abstraits. Je communique avec aisance avec un locuteur natif et je m'exprime de façon claire et détaillée sur une grande gamme de sujets.",
  },
  C1: {
    text: (
      <>
        <strong>C1 :</strong> communication avec grande aisance
      </>
    ),
    help: "Pratiquement aucune difficulté particulière.",
  },
  C2: {
    text: (
      <>
        <strong>C2 :</strong> communication de niveau bilingue
      </>
    ),
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
];
