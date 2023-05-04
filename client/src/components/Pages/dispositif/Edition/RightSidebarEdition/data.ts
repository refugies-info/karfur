export type Help = {
  title: string;
  text: string | string[];
}

export const titleHelp: Help = {
  title: "Résumez votre action en quelques mots",
  text: [
    "Commencez votre titre informatif par un verbe d’action à l'infinitif. Par exemple : « Apprendre le français » ou « Faire une formation ».",
    "Écrivez une phrase courte et simple, qui résume votre action."
  ]
}
export const titreMarqueHelp: Help = {
  title: "Indiquez le nom de votre dispositif",
  text: [
    "Précisez ici le nom de votre dispositif ou programme.",
    "Par exemple : « Volont’R », « PACEA », « Coop’R », « Refugeeks ».",
    "Si vous n’avez pas de nom spécifique, indiquez par défaut celui de votre structure.",
  ]
}
export const whatHelp: Help = {
  title: "Décrivez votre action en quelques lignes",
  text: [
    "Écrivez un court résumé qui présente les caractéristiques principales de votre action. L’objectif est que le lecteur puisse identifier rapidement en quoi consiste le dispositif et ce qu’il peut y trouver de concret.",
    "Par exemple : Quelle est la nature de votre dispositif (un cours, un programme d’accompagnement, une formation, un atelier, etc.) ? À quel objectif permet-il de répondre ?",
  ]
}
export const contentHelp: Help = {
  title: "Expliquez pourquoi votre action est utile",
  text: [
    "Rentrez ici dans les détails de votre action. 1 argument = 1 idée.",
    "Par exemple : « Améliorer votre niveau de français », « Rencontrer d’autres personnes », etc.",
    "N'oubliez pas d'apporter des précisions dans les descriptions de vos arguments.",
  ]
}

export const nextHelp: Help = {
  title: "Expliquer comment faire pour accéder au dispositif",
  text: [
    "Détailler les différentes étapes nécessaires : prise de contact, premier rendez-vous, formulaire d’inscription, etc. ",
    "Pensez à ajouter un contact (mail ou téléphone) si des personnes souhaitent vous poser des questions.",
    "Vous pouvez aussi utiliser la carte pour indiquer vos lieux d’accueil.",
  ]
}

export const mapHelp: Help = {
  title: "Cartographier vos lieux d’accueil",
  text: [
    "Ajoutez des points géolocalisés en recherchant une adresse dans la barre de recherche.",
    "Saisissez ensuite les informations de votre lieu d’accueil. Plus vous êtes précis (horaires d’ouverture, coordonnées, conditions d’accueil)... plus vous serez correctement sollicités !",
  ]
}
