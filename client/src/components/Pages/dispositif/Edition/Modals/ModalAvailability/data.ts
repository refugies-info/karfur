import { commitmentDetailsType, frequencyDetailsType, frequencyUnitType, timeSlotType, timeUnitType } from "api-types";

export const help = {
  title: "À quoi sert cette information ?",
  content: "Si c’est variable selon le profil : il faut cocher la case “cette question ne me concerne pas”",
};

export const commitmentDetailsOptions: commitmentDetailsType[] = [
  "minimum",
  "maximum",
  "approximately",
  "exactly",
  "between",
]
export const timeUnitOptions: timeUnitType[] = [

  "sessions",
  "hours",
  "half-days",
  "days",
  "weeks",
  "months",
  "trimesters",
  "semesters",
  "years",
]
export const frequencyDetailsOptions: frequencyDetailsType[] = [
  "minimum",
  "maximum",
  "approximately",
  "exactly",
];
export const frequencyUnitOptions: frequencyUnitType[] = [
  "session",
  "day",
  "week",
  "month",
  "trimester",
  "semester",
  "year",
]
export const timeSlotOptions: timeSlotType[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const modalTitles = [
  "Quelle est la durée d’engagement total demandée ?",
  "Quelle est la fréquence de participation au programme ou les créneaux disponibles ?",
  "Quels sont les créneaux disponibles ?"
]
