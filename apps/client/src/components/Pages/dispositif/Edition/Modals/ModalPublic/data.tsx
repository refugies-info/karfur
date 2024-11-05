import { ageType, frenchLevelType, publicStatusType, publicType } from "@refugies-info/api-types";
import React from "react";

export const help = [
  {
    title: "À quoi sert cette information ?",
    content: [
      "Votre action est-elle ouverte à tous ou est-elle réservée à des publics spécifiques ?",
      "Cochez ici les publics concernés (plusieurs choix sont possibles).",
    ],
  },
  {
    title: "Quelques conseils",
    content: [
      "Concentrez-vous sur le public qui peut accéder au dispositif.",
      "Il faut répondre à la question suivante : « Est-ce que mon dispositif est pertinent pour une personne de tel niveau ? »",
    ],
  },
  {
    title: "Quelques conseils",
    content: "Précisez ici l'âge demandé ou souhaité pour les bénéficiaires de votre action.",
  },
  {
    title: "Vous avez une proposition ?",
    content:
      "Si votre action est réservée à un autre public que ceux proposés ci-contre, n’hésitez pas à nous contacter sur le chat en bas à droite de votre écran.",
  },
];

export const publicStatusOptions: { type: publicStatusType; help: string }[] = [
  {
    type: "asile",
    help: "Personne demandant la reconnaissance de la qualité de réfugié ou le bénéfice de la protection subsidiaire, qui bénéficie du droit de se maintenir provisoirement sur le territoire dans l’attente d’une décision de l’OFPRA et/ou de la CNDA sur sa demande de protection.",
  },
  {
    type: "refugie",
    help: "Personne qui s'est vu octroyer une protection par l’OFPRA sur le fondement de la Convention de Genève. Une carte de résident portant la mention « réfugié », valable dix ans et renouvelable, lui est délivrée.",
  },
  {
    type: "subsidiaire",
    help: "La protection subsidiaire est accordée à la personne qui ne remplit pas les conditions d’octroi du statut de réfugié selon la Convention de Genève mais qui établit qu’elle est exposée dans son pays à une menace grave (peine de mort, torture, etc.). Une carte de séjour portant la mention « vie privée et familiale », valable quatre ans et renouvelable leur est délivrée.",
  },
  {
    type: "temporaire",
    help: "La protection temporaire est un dispositif particulier décidé au niveau européen lors d'afflux massif de personnes déplacées. Depuis le 3 mars 2022, les pays de l'Union européenne ont accordé le statut de « protection temporaire » aux Ukrainiens fuyant leur pays en guerre.",
  },
  {
    type: "apatride",
    help: "Un apatride est une personne sans nationalité, « qu'aucun État ne considère comme son ressortissant par application de sa législation » (Convention de New-York du 28 septembre 1954).",
  },
  { type: "french", help: "" },
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
        <strong>B1 :</strong> communication en français intermédiaire
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
        <strong>C2 :</strong> communication en français courant
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
  "Votre action est ouverte aux personnes âgées de :",
  "Votre action est-elle réservée à un public spécifique (optionnel) ?",
];
