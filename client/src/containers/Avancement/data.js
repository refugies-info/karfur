const diffData = {
  all: {
    title: "Avancement par langue",
    headers: [
      "Type de contenu",
      "Titre du contenu",
      "Mots traduits",
      "Avancement",
      "En attente depuis",
      "",
    ],
  },
  traducteur: {
    title: "Avancement de ",
    headers: [
      { name: "Titre", order: "title" },
      { name: "Progression", order: "avancement" },
      { name: "Mots", order: "nombreMots" },
      { name: "Depuis", order: "created_at" },
      { name: "Statut" },
      {
        name: "Type",
      },
      {
        name: "Dernière trad",
        order: "updatedAt",
      },
      { name: "" },
    ],
  },
  expert: {
    title: "Avancement de ",
    headers: [
      { name: "Titre", order: "title" },
      { name: "Progression trad", order: "avancementTrad" },

      { name: "Progression expert", order: "avancement" },
      { name: "Mots", order: "nombreMots" },
      { name: "Depuis", order: "created_at" },
      { name: "Statut" },
      {
        name: "Type",
      },
      {
        name: "Dernière trad",
        order: "updatedAt",
      },
      { name: "" },
    ],
  },
};

export { diffData };
