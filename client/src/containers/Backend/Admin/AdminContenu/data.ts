import { colors } from "colors";

type TableContenu = {
  title: string
  headers: {
    name: string
    order: string | null
  }[]
}
export const table_contenu: TableContenu = {
  title: "Contenu",
  headers: [
    {
      name: "Type",
      order: "typeContenu",
    },
    {
      name: "B",
      order: "needs",
    },
    {
      name: "Titre",
      order: "titreInformatif",
    },
    {
      name: "Structure",
      order: "mainSponsor",
    },
    {
      name: "MAJ",
      order: "lastModificationDate",
    },
    {
      name: "Progression",
      order: "",
    },
    {
      name: "Statut",
      order: "",
    },
    {
      name: "Merci",
      order: "nbMercis",
    },
    {
      name: "Vues",
      order: "nbVues",
    },

    {
      name: "Actions",
      order: null,
    },
  ],
};

const green = "#4CAF50";
const orange = "#FF9800";
const yellow = "#FFEB3B";
const red = "#F44336";
const lightGreen = "#8BC34A";

export type FilterContentStatus = "Actif" | "En attente" | "Brouillon" | "En attente non prioritaire" | "Rejeté structure" | "En attente admin" | "Accepté structure" | "Supprimé";

export type CorrespondingStatus = {
  storedStatus: FilterContentStatus
  displayedStatus: string
  color: string
  order: number
  textColor?: string
}

export const correspondingStatus: CorrespondingStatus[] = [
  {
    storedStatus: "Actif",
    displayedStatus: "Publié",
    color: green, order: 5
  },
  {
    storedStatus: "En attente",
    displayedStatus: "En attente",
    color: orange,
    order: 1,
    textColor: colors.white,
  },
  {
    storedStatus: "Brouillon",
    displayedStatus: "Brouillon",
    color: yellow,
    order: 3,
    textColor: colors.gray90,
  },
  {
    storedStatus: "En attente non prioritaire",
    displayedStatus: "Sans structure",
    color: red,
    order: 4,
    textColor: colors.white,
  },
  {
    storedStatus: "Rejeté structure",
    displayedStatus: "Rejeté",
    color: red,
    order: 6,
    textColor: colors.white,
  },
  {
    storedStatus: "En attente admin",
    displayedStatus: "À valider",
    color: lightGreen,
    order: 0,
    textColor: colors.white,
  },
  {
    storedStatus: "Accepté structure",
    displayedStatus: "Accepté",
    color: orange,
    order: 2,
    textColor: colors.white,
  },
  {
    storedStatus: "Supprimé",
    displayedStatus: "Supprimé",
    color: red,
    order: 7,
    textColor: colors.white,
  },
];

const darkBlue = colors.bleuCharte;
const lightBlue = colors.lightBlue;

type ProgressionData = {
  storedStatus: string
  displayedStatus: string
  color: string
  group: number
  textColor: string
}


export const publicationData: ProgressionData[] = [
  {
    storedStatus: "Nouveau !",
    displayedStatus: "Nouveau !",
    color: darkBlue,
    textColor: colors.white,
    group: 1,
  },
  {
    storedStatus: "À relire",
    displayedStatus: "À relire 🕶",
    color: lightBlue,
    textColor: colors.gray90,
    group: 1,
  },
  {
    storedStatus: "Contacté",
    displayedStatus: "Contacté 🔄",
    color: lightBlue,
    textColor: colors.gray90,
    group: 1,
  },
  {
    storedStatus: "À relancer",
    displayedStatus: "À relancer ⚠️",
    color: lightBlue,
    textColor: colors.gray90,
    group: 1,
  },
  {
    storedStatus: "Bloqué",
    displayedStatus: "Bloqué ⛔️",
    color: lightBlue,
    textColor: colors.gray90,
    group: 1,
  }
];

export const progressionData: ProgressionData[] = [
  {
    storedStatus: "0%",
    displayedStatus: "0%",
    color: lightBlue,
    textColor: colors.gray90,
    group: 2,
  },
  {
    storedStatus: "25%",
    displayedStatus: "25%",
    color: lightBlue,
    textColor: colors.gray90,
    group: 2,
  },
  {
    storedStatus: "50%",
    displayedStatus: "50%",
    color: lightBlue,
    textColor: colors.gray90,
    group: 2,
  },
  {
    storedStatus: "75%",
    displayedStatus: "75%",
    color: lightBlue,
    textColor: colors.gray90,
    group: 2,
  },
  {
    storedStatus: "100%",
    displayedStatus: "100%",
    color: lightBlue,
    textColor: colors.gray90,
    group: 2,
  },
];
