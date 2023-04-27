interface Content {
  title: string;
  intro: string | null;
  items: string[];
}

export const contents: Record<string, Content> = {
  draft: {
    title: "Que se passe-t-il quand vous quittez l’éditeur ?",
    intro: null,
    items: [
      "Votre fiche est enregistrée dans vos brouillons.",
      "Tant qu’elle est en brouillon, elle est visible uniquement par vous.",
      "Vous devez la valider pour qu’elle soit envoyée à notre équipe éditoriale pour relecture."
    ]
  },
  waiting: {
    title: "Attention, votre fiche n’est plus complète !",
    intro: "Vous allez quitter l’éditeur mais il manque certaines informations. Que va-t-il se passer ?",
    items: [
      "Votre fiche redevient un brouillon.",
      "Vous devez la compléter et la valider pour qu’elle soit à nouveau envoyée à notre équipe éditoriale pour relecture.",
    ]
  },
  publishedIncomplete: {
    title: "Attention, votre fiche n’est plus complète !",
    intro: "Vous allez quitter l’éditeur mais il manque certaines informations. Que va-t-il se passer ?",
    items: [
      "L’ancienne version est toujours publiée et visible par les utilisateurs.",
      "Votre nouvelle version de travail est enregistrée en tant que brouillon.",
      "Vous devez revenir la compléter et la valider pour qu’elle soit publiée à la place de l’ancienne version."
    ]
  },
  publishedComplete: {
    title: "Vous ne voulez pas valider votre fiche ?",
    intro: "Vous êtes sur le point de quitter l’éditeur sans avoir envoyé vos modifications pour traduction. ",
    items: [
      "L’ancienne version est toujours publiée et visible par les utilisateurs.",
      "Votre nouvelle version de travail est enregistrée en tant que brouillon.",
      "Vous devez revenir la compléter et la valider pour qu’elle soit publiée à la place de l’ancienne version."
    ]
  },
}
