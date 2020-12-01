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
      order: "titreInformatif",
      hideOnPhone: false,
    },
    {
      name: "Structure",
      order: "mainSponsor",
      hideOnPhone: false,
    },
    {
      name: "MAJ",
      order: "updatedAt",
      hideOnPhone: true,
    },
    {
      name: "Progression",
      order: "",
      hideOnPhone: true,
    },
    {
      name: "Statut",
      order: "",
      hideOnPhone: false,
    },

    {
      name: "Actions",
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

const green = "#4CAF50";
const orange = "#FF9800";
const yellow = "#FFEB3B";
const red = "#F44336";
const lightGreen = "#8BC34A";

export const correspondingStatus = [
  { storedStatus: "Actif", displayedStatus: "Publié", color: green, order: 5 },
  {
    storedStatus: "En attente",
    displayedStatus: "En attente",
    color: orange,
    order: 1,
  },
  {
    storedStatus: "Brouillon",
    displayedStatus: "Brouillon",
    color: yellow,
    order: 3,
  },
  {
    storedStatus: "En attente non prioritaire",
    displayedStatus: "Sans structure",
    color: red,
    order: 4,
  },
  {
    storedStatus: "Rejeté structure",
    displayedStatus: "Rejeté",
    color: red,
    order: 6,
  },
  {
    storedStatus: "En attente admin",
    displayedStatus: "A valider",
    color: lightGreen,
    order: 0,
  },
  {
    storedStatus: "Accepté structure",
    displayedStatus: "Accepté",
    color: orange,
    order: 2,
  },
  {
    storedStatus: "Supprimé",
    displayedStatus: "Supprimé",
    color: red,
    order: 7,
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
