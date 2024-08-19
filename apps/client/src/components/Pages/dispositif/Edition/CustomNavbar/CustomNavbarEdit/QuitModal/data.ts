interface Content {
  title: string;
  intro: string | null;
  items: string[];
  buttonText: string;
}

export const contents: Record<string, Content> = {
  draftIncomplete: {
    title: "Que se passe-t-il quand vous quittez l’éditeur ?",
    intro: null,
    items: [
      "Votre fiche est enregistrée dans vos brouillons.",
      "Tant qu’elle est en brouillon, elle est visible uniquement par vous.",
      "Vous devrez la compléter et la valider pour qu’elle soit envoyée à notre équipe éditoriale pour relecture."
    ],
    buttonText: "Rester dans l'éditeur"
  },
  draftComplete: {
    title: "Pourquoi ne pas valider votre fiche ?",
    intro: "Vous êtes sur le point de quitter l’éditeur sans avoir envoyé votre fiche pour relecture.",
    items: [
      "Votre fiche est enregistrée dans vos brouillons.",
      "Tant qu’elle est en brouillon, elle est visible uniquement par vous.",
      "Vous devrez la valider pour qu’elle soit envoyée à notre équipe éditoriale pour relecture."
    ],
    buttonText: "Valider ma fiche"
  },
  waitingIncomplete: {
    title: "Attention, votre fiche n’est plus complète !",
    intro: "Vous allez quitter l’éditeur mais il manque certaines informations. Que va-t-il se passer ?",
    items: [
      "Votre fiche redevient un brouillon.",
      "Vous devrez la compléter et la valider pour qu’elle soit à nouveau envoyée à notre équipe éditoriale pour relecture.",
    ],
    buttonText: "Rester dans l'éditeur"
  },
  publishedIncomplete: {
    title: "Attention, la mise à jour de votre fiche n’est pas encore en ligne !",
    intro: "Vous allez quitter l’éditeur mais il manque certaines informations. Que va-t-il se passer ?",
    items: [
      "L’ancienne version est toujours publiée et visible par les utilisateurs.",
      "Votre nouvelle version de travail est enregistrée en tant que brouillon.",
      "Vous devrez revenir la compléter et la valider pour qu’elle soit publiée à la place de l’ancienne version."
    ],
    buttonText: "Rester dans l'éditeur"
  },
  publishedComplete: {
    title: "Pourquoi ne pas valider votre fiche ?",
    intro: "Vous êtes sur le point de quitter l’éditeur sans avoir envoyé vos modifications pour traduction.",
    items: [
      "L’ancienne version est toujours publiée et visible par les utilisateurs.",
      "Votre nouvelle version de travail est enregistrée en tant que brouillon.",
      "Vous devrez revenir la valider pour qu’elle soit publiée à la place de l’ancienne version."
    ],
    buttonText: "Envoyer pour traduction"
  },
}
