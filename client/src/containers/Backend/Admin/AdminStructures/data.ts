import { colors } from "colors";
import { ProgressionStatus, StructureStatus } from "types/interface";

export const headers = [
  { name: "Nom", order: "nom" },
  { name: "Statut", order: "" },
  { name: "Membres", order: "nbMembres" },
  { name: "Responsable", order: "responsable" },
  { name: "Fiches", order: "nbFiches" },
  { name: "Création", order: "created_at" },
];

const green = "#4CAF50";
const orange = "#FF9800";
const red = "#F44336";

export const correspondingStatus: StructureStatus[] = [
  {
    displayedStatus: "Actif",
    storedStatus: "Actif",
    color: green,
    order: 2
  },
  {
    displayedStatus: "En attente",
    storedStatus: "En attente",
    color: orange,
    order: 1
  },
  {
    displayedStatus: "Supprimé",
    storedStatus: "Supprimé",
    color: red,
    order: 3
  },
];

export const publicationStatus: ProgressionStatus[] = [
  {
    storedStatus: "Contacté",
    displayedStatus: "Contacté 🔄",
    color: colors.lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "À relancer",
    displayedStatus: "À relancer ⚠️",
    color: colors.lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "À repêcher",
    displayedStatus: "À repêcher 🎣",
    color: colors.lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "À réconcilier",
    displayedStatus: "À réconcilier 🤝",
    color: colors.lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "Doublons",
    displayedStatus: "Doublons 👥",
    color: colors.lightBlue,
    textColor: colors.gray90,
  },
];

export const progressionStatus: ProgressionStatus[] = [
  {
    storedStatus: "0%",
    displayedStatus: "0%",
    color: colors.lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "25%",
    displayedStatus: "25%",
    color: colors.lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "50%",
    displayedStatus: "50%",
    color: colors.lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "75%",
    displayedStatus: "75%",
    color: colors.lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "100%",
    displayedStatus: "100%",
    color: colors.lightBlue,
    textColor: colors.gray90,
  },
];

