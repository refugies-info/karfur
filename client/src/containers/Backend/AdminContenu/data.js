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
