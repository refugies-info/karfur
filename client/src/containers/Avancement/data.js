const diffData = {
  all: {
    title: "Avancement par langue",
    headers: [
      "Type de contenu",
      "Titre du contenu",
      "Mots traduits",
      "Avancement",
      "En attente depuis",
      ""
    ]
  },
  traducteur: {
    title: "Avancement de ",
    headers: [
      {
        name: "Type de contenu",
        order: "typeContenu"
      },
      { name: "Titre du contenu", order: "title" },
      { name: "Mots traduits", order: "nombreMots" },
      { name: "Avancement", order: "avancement" },
      { name: "En attente depuis", order: "updatedAt" },
      { name: "" }
    ]
  },
  expert: {
    title: "Avancement de ",
    headers: [
      {
        name: "Type de contenu",
        order: "typeContenu"
      },
      { name: "Titre du contenu", order: "title" },
      { name: "Nombre de mots", order: "nombreMots" },
      { name: "Traducteurs", order: "users" },
      { name: "Status", order: "statusTrad" },
      { name: "En attente depuis", order: "updatedAt" },
      { name: "" }
    ]
  }
};

export { diffData };
