import { amountDetailsType, frequencyUnitType, timeSlotType, timeUnitType } from "api-types";

export const help = {
  title: "À quoi sert cette information ?",
  content: "Si c’est variable selon le profil : il faut cocher la case “cette question ne me concerne pas”",
};

export const amountDetailsOptions: Record<amountDetailsType, string> = {
  atLeast: "Au moins",
  approximately: "Environ",
  mandatory: "Obligatoirement",
};
export const timeUnitOptions: Record<timeUnitType, string> = {
  hours: "heures",
  days: "jours",
  weeks: "semaines",
  months: "mois",
  trimesters: "trimestres",
  semesters: "semestres",
  years: "années",
};
export const frequencyUnitOptions: Record<frequencyUnitType, string> = {
  day: "jour",
  week: "semaine",
  month: "mois",
  trimester: "trimestre",
  semester: "semestre",
  year: "année",
};
export const timeSlotOptions: timeSlotType[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
