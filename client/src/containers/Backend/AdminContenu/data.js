import variables from "scss/colors.scss";

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
    textColor: variables.blancSimple,
  },
  {
    storedStatus: "Brouillon",
    displayedStatus: "Brouillon",
    color: yellow,
    order: 3,
    textColor: variables.darkColor,
  },
  {
    storedStatus: "En attente non prioritaire",
    displayedStatus: "Sans structure",
    color: red,
    order: 4,
    textColor: variables.blancSimple,
  },
  {
    storedStatus: "Rejeté structure",
    displayedStatus: "Rejeté",
    color: red,
    order: 6,
    textColor: variables.blancSimple,
  },
  {
    storedStatus: "En attente admin",
    displayedStatus: "A valider",
    color: lightGreen,
    order: 0,
    textColor: variables.blancSimple,
  },
  {
    storedStatus: "Accepté structure",
    displayedStatus: "Accepté",
    color: orange,
    order: 2,
    textColor: variables.blancSimple,
  },
  {
    storedStatus: "Supprimé",
    displayedStatus: "Supprimé",
    color: red,
    order: 7,
    textColor: variables.blancSimple,
  },
];

const darkBlue = variables.bleuCharte;
const lightBlue = variables.lightBlue;

export const progressionData = [
  { storedStatus: "Nouveau !", displayedStatus: "Nouveau !", color: darkBlue },
  {
    storedStatus: "Contacté",
    displayedStatus: "Contacté",
    color: lightBlue,
    textColor: variables.darkColor,
  },
  {
    storedStatus: "À relancer",
    displayedStatus: "À relancer",
    color: lightBlue,
    textColor: variables.darkColor,
  },
  {
    storedStatus: "Bloqué",
    displayedStatus: "Bloqué",
    color: lightBlue,
    textColor: variables.darkColor,
  },
  {
    storedStatus: "0%",
    displayedStatus: "0%",
    color: lightBlue,
    textColor: variables.darkColor,
  },
  {
    storedStatus: "25%",
    displayedStatus: "25%",
    color: lightBlue,
    textColor: variables.darkColor,
  },
  {
    storedStatus: "50%",
    displayedStatus: "50%",
    color: lightBlue,
    textColor: variables.darkColor,
  },
  {
    storedStatus: "75%",
    displayedStatus: "75%",
    color: lightBlue,
    textColor: variables.darkColor,
  },
  {
    storedStatus: "100%",
    displayedStatus: "100%",
    color: lightBlue,
    textColor: variables.darkColor,
  },
];
