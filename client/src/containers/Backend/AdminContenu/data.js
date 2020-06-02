export const table_contenu = {
  title: "Contenu",
  headers: [
    {
      name: "Type",
      order: "typeContenu",
      hideOnPhone: false,
    },
    {
      name: "Titre",
      order: "titreCourt",
      hideOnPhone: false,
    },
    {
      name: "Structure",
      order: "structure",
      hideOnPhone: false,
    },
    {
      name: "Depuis",
      order: "updatedAt",
      hideOnPhone: true,
    },
    {
      name: "Statut",
      order: "status",
      hideOnPhone: true,
    },
    {
      name: "Responsable",
      order: "responsable",
      hideOnPhone: false,
    },
    {
      name: "Action interne",
      order: "internal_action",
      hideOnPhone: false,
    },
    {
      name: "Variantes",
      order: "children.length",
      hideOnPhone: false,
    },
    {
      name: "Suppr",
      hideOnPhone: false,
    },
    {
      name: "Voir",
      hideOnPhone: false,
    },
    {
      name: "Publier",
      hideOnPhone: false,
    },
  ],
};

export const status_mapping = [
  {
    name: "Actif",
    color: "",
  },
  {
    name: "Accepté structure",
    color: "attention",
  },
  {
    name: "En attente",
    color: "standby",
  },
  {
    name: "En attente admin",
    color: "validation",
  },
  {
    name: "En attente non prioritaire",
    color: "focus",
  },
  {
    name: "Brouillon",
    color: "attention",
  },
  {
    name: "Rejeté structure",
    color: "erreur",
  },
  {
    name: "Rejeté admin",
    color: "erreur",
  },
  {
    name: "Inactif",
    color: "",
  },
  {
    name: "Supprimé",
    color: "erreur",
  },
];

export const responsables = [
  "Hugo",
  "Simon",
  "Nour",
  "Développeur",
  "Groot",
  "Starlord",
];

export const internal_actions = [
  "Prêt",
  "Contact",
  "Relire",
  "En attente",
  "Refaire",
  "URGENT",
  "Discuter",
  "Nouveau",
];

export const status_sort_arr = [
  "En attente admin",
  "En attente",
  "En attente non prioritaire",
  "Brouillon",
  "Accepté structure",
  "Actif",
  "Rejeté structure",
  "Rejeté admin",
  "Supprimé",
  "Inactif",
];
