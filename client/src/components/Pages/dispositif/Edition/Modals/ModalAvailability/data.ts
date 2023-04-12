import { commitmentDetailsType, frequencyDetailsType, frequencyUnitType, timeSlotType, timeUnitType } from "api-types";

export const help = {
  title: "À quoi sert cette information ?",
  content: "Si c’est variable selon le profil : il faut cocher la case “cette question ne me concerne pas”",
};

export const commitmentDetailsOptions: Record<commitmentDetailsType, string> = {
  minimum: "Minimum",
  maximum: "Maximum",
  approximately: "Environ",
  exactly: "Exactement",
  between: "Entre"
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
export const frequencyDetailsOptions: Record<frequencyDetailsType, string> = {
  minimum: "Minimum",
  maximum: "Maximum",
  approximately: "Environ",
  exactly: "Exactement",
};
export const frequencyUnitOptions: Record<frequencyUnitType, string> = {
  day: "jour",
  week: "semaine",
  month: "mois",
  trimester: "trimestre",
  semester: "semestre",
  year: "an",
};
export const timeSlotOptions: timeSlotType[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const modalTitles = [
  "Quelle est la durée d’engagement total demandée ?",
  "Quelle est la fréquence de participation au programme ou les créneaux disponibles ?",
  "Quels sont les créneaux disponibles ?"
]
