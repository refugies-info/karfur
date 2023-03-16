export type Help = {
  title: string;
  text: string | string[];
}

export const titleHelp: Help = {
  title: "Le titre doit résumer votre action",
  text: [
    "Commencez par un verbe à l'infinitif. Par exemple : « Passer son permis ».",
    "Essayez une phrase d’action simple qui résume le cœur de votre action."
  ]
}
export const whatHelp: Help = {
  title: "Décrivez votre action en quelques lignes",
  text: "C’est une accroche résumée qui présente brièvement les caractéristiques principales de votre action, pour donner envie et vous différencier des autres actions. "
}
export const contentHelp: Help = {
  title: "Détaillez les arguments pour décrire votre action",
  text: [
    "Rentrez ici dans les détails de votre action. 1 argument = 1 idée. Par exemple : « Améliorer votre niveau de français », « Rencontrer d’autres personnes », etc.",
    "N’oubliez pas d’apporter des détails dans les descriptions de votre argument."
  ]

}
