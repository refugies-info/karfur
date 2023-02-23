import { colors } from "colors";
import { ContentStatus, ProgressionStatus } from "types/interface";
import { DispositifStatus } from "api-types";

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

export const correspondingStatus: ContentStatus[] = [
  {
    storedStatus: DispositifStatus.ACTIVE,
    displayedStatus: "Publié",
    color: green,
    order: 5
  },
  {
    storedStatus: DispositifStatus.WAITING,
    displayedStatus: "En attente",
    color: orange,
    order: 1,
    textColor: colors.white,
  },
  {
    storedStatus: DispositifStatus.DRAFT,
    displayedStatus: "Brouillon",
    color: yellow,
    order: 3,
    textColor: colors.gray90,
  },
  {
    storedStatus: DispositifStatus.NO_STRUCTURE,
    displayedStatus: "Sans structure",
    color: red,
    order: 4,
    textColor: colors.white,
  },
  {
    storedStatus: DispositifStatus.KO_STRUCTURE,
    displayedStatus: "Rejeté",
    color: red,
    order: 6,
    textColor: colors.white,
  },
  {
    storedStatus: DispositifStatus.WAITING_ADMIN,
    displayedStatus: "À valider",
    color: lightGreen,
    order: 0,
    textColor: colors.white,
  },
  {
    storedStatus: DispositifStatus.OK_STRUCTURE,
    displayedStatus: "Accepté",
    color: orange,
    order: 2,
    textColor: colors.white,
  },
  {
    storedStatus: DispositifStatus.DELETED,
    displayedStatus: "Supprimé",
    color: red,
    order: 7,
    textColor: colors.white,
  },
];

const darkBlue = colors.bleuCharte;
const lightBlue = colors.lightBlue;

export const publicationData: ProgressionStatus[] = [
  {
    storedStatus: "Nouveau !",
    displayedStatus: "Nouveau !",
    color: darkBlue,
    textColor: colors.white,
  },
  {
    storedStatus: "À relire",
    displayedStatus: "À relire 🕶",
    color: lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "Contacté",
    displayedStatus: "Contacté 🔄",
    color: lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "À relancer",
    displayedStatus: "À relancer ⚠️",
    color: lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "Bloqué",
    displayedStatus: "Bloqué ⛔️",
    color: lightBlue,
    textColor: colors.gray90,
  }
];

export const progressionData: ProgressionStatus[] = [
  {
    storedStatus: "0%",
    displayedStatus: "0%",
    color: lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "25%",
    displayedStatus: "25%",
    color: lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "50%",
    displayedStatus: "50%",
    color: lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "75%",
    displayedStatus: "75%",
    color: lightBlue,
    textColor: colors.gray90,
  },
  {
    storedStatus: "100%",
    displayedStatus: "100%",
    color: lightBlue,
    textColor: colors.gray90,
  },
];
