import { commitmentDetailsType, frequencyDetailsType, frequencyUnitType, timeSlotType, timeUnitType } from "@refugies-info/api-types";

export const help = [

  {
    title: "Quelques conseils",
    content: [
      "Indiquez la durée d’engagement demandée au bénéficiaire. Vous pourrez préciser la fréquence à l’étape suivante.",
      "Si la durée varie selon les personnes, cochez « Cette information n’est pas pertinente pour mon action » et expliquez les détails dans votre fiche."
    ]
  },
  {
    title: "Quelques conseils",
    content: "Si cette information varie selon les personnes, cochez la case « Cette information n’est pas pertinente pour mon action » et expliquez les détails dans votre fiche."
  },
  {
    title: "Quelques conseils",
    content: [
      "Si les jours pendant lesquels se déroule votre action sont fixes, précisez-les !",
      "Si les jours varient, cochez la case « Ce n’est pas pertinent pour mon action » et expliquez les détails dans votre fiche.",
    ]
  }
]

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
  "Quelle est la durée totale de votre action ?",
  "Quelle est la fréquence de participation ?",
  "Quels sont les jours de présence ?"
]
