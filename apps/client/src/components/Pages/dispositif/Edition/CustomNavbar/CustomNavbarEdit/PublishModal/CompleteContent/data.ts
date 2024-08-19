export type Content = {
  title: string;
  intro: string;
}

export const help: Record<string, Content[]> = {
  draft: [
    {
      title: "Tout est prêt, envoyez votre fiche pour relecture !",
      intro: "Toutes les informations sont désormais renseignées. Votre fiche va être transférée à notre équipe éditoriale pour relecture."
    },
    {
      title: "Merci pour votre participation !",
      intro: "Votre fiche va maintenant passer entre les mains de nos différentes équipes pour relecture puis traduction. Vous serez informés !"
    }
  ],
  waiting: [
    {
      title: "Tout est prêt, envoyez votre fiche pour relecture !",
      intro: "Vos modifications ont bien été prises en compte. Votre fiche va à nouveau être transférée à notre équipe éditoriale pour relecture."
    },
    {
      title: "Merci pour votre participation !",
      intro: "Votre fiche va maintenant passer entre les mains de nos différentes équipes pour relecture puis traduction. Vous serez informés !"
    }
  ],
  published: [
    {
      title: "Tout est prêt, envoyez votre fiche pour traduction !",
      intro: "Pensez bien à faire toutes vos modifications avant de les envoyer pour traduction. Sinon, les traducteurs travaillent deux fois de suite sur votre fiche."
    },
    {
      title: "Faut-il faire traduire les modifications ?",
      intro: "En tant qu’administrateur de Réfugiés.info, tu peux choisir de ne pas faire traduire tes modifications. Fais-le seulement pour des fautes d’orthographe ou de syntaxe, mais pas si tu ajoutes des informations ou si tu modifies le sens des phrases !"
    }
  ],
  nochange: [
    {
      title: "Super, pas besoin de traduction !",
      intro: "Les modifications que tu as effectuées sur cette fiche n'ont pas besoin d'être traduites. Tu peux les publier en toute tranquilité, cela ne déclenchera pas un nouveau processus de traduction."
    }
  ]
}
