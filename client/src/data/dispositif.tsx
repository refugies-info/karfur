import React from "react";
import h2p from "html2plaintext";
import Image from "next/legacy/image";
import { DispositifContent } from "types/interface";

export type ShortContent = {
  titreInformatif: string
  titreMarque: string
  abstract: string
  contact: string
  externalLink: string
}
const contenu: ShortContent = {
  titreInformatif: "Titre informatif",
  titreMarque: "Le nom du dispositif",
  abstract: "",
  contact: "contact@lab-r.fr",
  externalLink: "",
};

const showModals = {
  reaction: false,
  fiabilite: false,
  merci: false,
  allGood: false,
  construction: false,
  map: false,
  responsable: false,
  rejection: false,
  variante: false,
};

const menu: DispositifContent[] = [
  {
    title: "C'est quoi ?",
    content: "",
  },
  {
    title: "C'est pour qui ?",
    type: "cards",
    content: null,
    children: [
      {
        type: "card",
        isFakeContent: true,
        title: "Public visé",
        titleIcon: "papiers",
        contentTitle: "réfugiés",
        contentBody: "ou bénéficiaire de la protection subsidiaire",
        footer: "En savoir plus",
        footerIcon: "info-outline",
      },
      {
        type: "card",
        isFakeContent: true,
        title: "Âge requis",
        titleIcon: "calendar-outline",
        typeIcon: "eva",
        contentTitle: "Plus de ** ans",
        bottomValue: 18,
        topValue: 60,
      },
      {
        type: "card",
        isFakeContent: true,
        title: "Durée",
        titleIcon: "clock-outline",
        typeIcon: "eva",
        contentTitle: "6 à 12 mois",
      },
      {
        type: "card",
        isFakeContent: true,
        title: "Niveau de français",
        titleIcon: "frBubble",
        contentTitle: "Débutant",
        niveaux: [],
        footer: "Évaluer mon niveau",
        footerIcon: "bar-chart-outline",
        tooltipFooter: "En savoir plus",
      },
      {
        type: "card",
        isFakeContent: true,
        title: "Combien ça coûte ?",
        titleIcon: "pricetags-outline",
        typeIcon: "eva",
        free: true,
        price: 0,
        contentTitle: "une seule fois",
      },
      {
        type: "card",
        isFakeContent: true,
        title: "Zone d'action",
        titleIcon: "pin-outline",
        typeIcon: "eva",
        departments: [],
        free: true,
        contentTitle: "Sélectionner",
      },
    ],
  },
  {
    title: "Pourquoi c'est intéressant ?",
    content: null,
    children: [
      {
        isFakeContent: true,
        type: "accordion",
        content: "",
      },
    ],
  },
  {
    title: "Comment je m'engage ?",
    content: null,
    children: [
      {
        type: "accordion",
        isFakeContent: true,
        content: "",
      },
      { type: "map", isFakeContent: true, isMapLoaded: true, markers: [] },
    ],
  },
];

const infocardFranceEntiere = {
  type: "card",
  title: "Zone d'action",
  titleIcon: "pin-outline",
  typeIcon: "eva",
  departments: ["All"],
  editable: false,
  content: ""
};
const menuDemarche: DispositifContent[] = [
  {
    title: "C'est quoi ?",
    content: "",
    type: ""
  },
  {
    title: "C'est pour qui ?",
    type: "cards",
    content: "",

    children: [
      infocardFranceEntiere,
      {
        type: "card",
        title: "Âge requis",
        titleIcon: "calendar-outline",
        typeIcon: "eva",
        contentTitle: "Plus de ** ans",
        bottomValue: 18,
        topValue: 60,
      },
      {
        type: "card",
        title: "Titre de séjour",
        typeIcon: "eva",
        titleIcon: "alert-triangle-outline",
      },
      {
        type: "card",
        title: "Acte de naissance OFPRA",
        typeIcon: "eva",
        titleIcon: "alert-triangle-outline",
      },
    ],
  },
  {
    title: "Comment faire ?",
    content: null,
    type: "",

    children: [
      {
        isFakeContent: true,
        type: "etape",

        content: "",
        papiers: [],
        duree: "00",
        timeStepDuree: "minutes",
        delai: "00",
        timeStepDelai: "minutes",
        option: {},
      },
      {
        isFakeContent: true,
        type: "etape",

        content: "",
        papiers: [],
        duree: "00",
        timeStepDuree: "minutes",
        delai: "00",
        timeStepDelai: "minutes",
        option: {},
      },
    ],
  },
  {
    title: "Et après ?",
    content: null,
    type: "",

    children: [
      {
        type: "accordion",
        isFakeContent: true,
        content: "",
      },
    ],
  },
];

//@ts-ignore
const infocardsDemarcheTitles = menuDemarche[1].children.map(
  //@ts-ignore
  (child) => child.title
);

const importantCard = {
  type: "card",
  isFakeContent: true,
  title: "Important !",
  titleIcon: "alert-triangle-outline",
  typeIcon: "eva",
  contentTitle: "Votre message",
  footer: "Ajouter un message complémentaire",
  footerType: "text",
  tooltipHeader: "Critère spécifique",
  tooltipContent:
    "Vous avez la possibilité d’ajouter jusqu’à 3 critères supplémentaires pour prévenir les utilisateurs. Choisissez un titre court puis ajoutez une brève description.",
};

const filtres = {
  audience: ["réfugié", "tout public"],
  audienceAge: ["De ** à ** ans", "Moins de ** ans", "Plus de ** ans"],
  niveauFrancais: ["Débutant", "Intermédiaire", "Avancé", "Tous les niveaux"],
  justificatifs: [
    "Titre de séjour",
    "Justificatif de domicile",
    "Diplôme",
    "Permis de conduire",
  ],
  departmentsData: [
    "1 - Ain",
    "2 - Aisne",
    "3 - Allier",
    "4 - Alpes-de-Haute-Provence",
    "5 - Hautes-Alpes",
    "6 - Alpes-Maritimes",
    "7 - Ardèche",
    "8 - Ardennes",
    "9 - Ariège",
    "10 - Aube",
    "11 - Aude",
    "12 - Aveyron",
    "13 - Bouches-du-Rhône",
    "14 - Calvados",
    "15 - Cantal",
    "16 - Charente",
    "17 - Charente-Maritime",
    "18 - Cher",
    "19 - Corrèze",
    "21 - Côte-d'Or",
    "22 - Côtes-d'Armor",
    "23 - Creuse",
    "24 - Dordogne",
    "25 - Doubs",
    "26 - Drôme",
    "27 - Eure",
    "28 - Eure-et-Loir",
    "29 - Finistère",
    "2A - Corse-du-Sud",
    "2B - Haute-Corse",
    "30 - Gard",
    "31 - Haute-Garonne",
    "32 - Gers",
    "33 - Gironde",
    "34 - Hérault",
    "35 - Ille-et-Vilaine",
    "36 - Indre",
    "37 - Indre-et-Loire",
    "38 - Isère",
    "39 - Jura",
    "40 - Landes",
    "41 - Loir-et-Cher",
    "42 - Loire",
    "43 - Haute-Loire",
    "44 - Loire-Atlantique",
    "45 - Loiret",
    "46 - Lot",
    "47 - Lot-et-Garonne",
    "48 - Lozère",
    "49 - Maine-et-Loire",
    "50 - Manche",
    "51 - Marne",
    "52 - Haute-Marne",
    "53 - Mayenne",
    "54 - Meurthe-et-Moselle",
    "55 - Meuse",
    "56 - Morbihan",
    "57 - Moselle",
    "58 - Nièvre",
    "59 - Nord",
    "60 - Oise",
    "61 - Orne",
    "62 - Pas-de-Calais",
    "63 - Puy-de-Dôme",
    "64 - Pyrénées-Atlantiques",
    "65 - Hautes-Pyrénées",
    "66 - Pyrénées-Orientales",
    "67 - Bas-Rhin",
    "68 - Haut-Rhin",
    "69 - Rhône",
    "70 - Haute-Saône",
    "71 - Saône-et-Loire",
    "72 - Sarthe",
    "73 - Savoie",
    "74 - Haute-Savoie",
    "75 - Paris",
    "76 - Seine-Maritime",
    "77 - Seine-et-Marne",
    "78 - Yvelines",
    "79 - Deux-Sèvres",
    "80 - Somme",
    "81 - Tarn",
    "82 - Tarn-et-Garonne",
    "83 - Var",
    "84 - Vaucluse",
    "85 - Vendée",
    "86 - Vienne",
    "87 - Haute-Vienne",
    "88 - Vosges",
    "89 - Yonne",
    "90 - Territoire de Belfort",
    "91 - Essonne",
    "92 - Hauts-de-Seine",
    "93 - Seine-Saint-Denis",
    "94 - Val-de-Marne",
    "95 - Val-d'Oise",
    "971 - Guadeloupe",
    "972 - Martinique",
    "973 - Guyane",
    "974 - La Réunion",
    "976 - Mayotte",
  ],
};

const cardTitlesDispositif = [
  { title: "Public visé", titleIcon: "papiers", options: filtres.audience },
  {
    title: "Âge requis",
    titleIcon: "calendar-outline",
    options: filtres.audienceAge,
  },
  { title: "Durée", titleIcon: "clock-outline" },
  {
    title: "Niveau de français",
    titleIcon: "frBubble",
    options: filtres.niveauFrancais,
  },
  { title: "Combien ça coûte ?", titleIcon: "pricetags-outline" },

  { title: "Important !", titleIcon: "alert-triangle-outline" },
  {
    title: "Zone d'action",
    titleIcon: "pin-outline",
    options: filtres.departmentsData,
  },
];

const cardTitlesDemarche = [
  {
    title: "Âge requis",
    titleIcon: "calendar-outline",
    options: filtres.audienceAge,
  },
  {
    title: "Zone d'action",
    titleIcon: "pin-outline",
    options: filtres.departmentsData,
  },
  {
    title: "Titre de séjour",
    titleIcon: "alert-triangle-outline",
  },
  {
    title: "Acte de naissance OFPRA",
    titleIcon: "alert-triangle-outline",
  },
];

const onBoardSteps = [
  {
    title: "C’est parti !",
    firstStep: true,
  },
  {
    title: "Modifiez directement le texte",
    content: (
      <h5>
        Cliquez sur les éléments surlignés{" "}
        <span className="texte-jaune">en jaune</span> pour saisir votre texte.
      </h5>
    ),
  },
  {
    title: "Suivez le guide",
    content: (
      <h5>
        Des consignes sont proposées pour chaque{" "}
        <span className="texte-jaune">élément modifiable</span>.
      </h5>
    ),
  },
  {
    title: "Tout à portée de main",
    content: (
      <h5>
        Ce menu vous suit dans votre rédaction. Vous pouvez désactiver les
        consignes, sauvegarder votre brouillon et accéder à{" "}
        <span className="texte-rouge">plus d’aide</span>.
      </h5>
    ),
  },
];


export type Option = {
  texte: string
  logo: string
  label1: string|null
  label2: string|null
  placeholder1: string
  placeholder2: string|null
  placeholder3?: string
  placeholder4?: string
  checkbox?: string
  icon1?: string
  icon2?: string
  icon3?: string
  icon4?: string
  ctaText: string
  ctaField?: string
  modalHeader: string
}

export type DemarcheSteps = {
  options: Option[];
  timeSteps: { texte: string }[];
  papiers: { texte: string }[];
}

const demarcheSteps: DemarcheSteps = {
  options: [
    {
      texte: "En ligne",
      logo: "at",
      label1: "Lien vers la démarche :",
      label2: "Texte sur le bouton :",
      placeholder1: "Copiez-collez ici l’URL de votre lien",
      placeholder2: "Ex : “Évaluer mes droits en ligne”",
      checkbox: "Je ne connais pas le lien exact à ajouter",
      icon1: "link-2",
      icon2: "external-link",
      ctaText: "Évaluer mes droits en ligne",
      ctaField: "value2",
      modalHeader: "Clique sur ce lien",
    },
    {
      texte: "En physique",
      logo: "pin",
      label1: "Adresse :",
      label2: null,
      placeholder1:
        "Indiquez ici l’adresse à laquelle les usagers doivent se rendre",
      placeholder2: null,
      checkbox: "Je ne connais pas l’adresse exacte à ajouter",
      icon1: "pin",
      ctaText: "Voir l’adresse",
      ctaField: "value1",
      modalHeader: "Ton lieu de rendez-vous est",
    },
    {
      texte: "Par téléphone",
      logo: "phone-call",
      label1: "Numéro :",
      label2: null,
      placeholder1:
        "Insérez ici le numéro de téléphone à faire composer aux usagers",
      placeholder2: null,
      checkbox: "Je ne connais pas le numéro exact à ajouter",
      icon1: "phone-call",
      ctaText: "Voir le numéro de téléphone",
      modalHeader: "Numéro à appeler",
    },
    {
      texte: "Par courrier",
      logo: "email",
      label1: null,
      label2: null,
      placeholder1: "Numéro et libéllé de la voie",
      placeholder2: "Code postal",
      placeholder3: "Ville",
      placeholder4: "Cedex",
      checkbox: "Je ne connais pas l’adresse postale exacte à ajouter",
      icon1: "home",
      icon2: "hash",
      icon3: "pin",
      icon4: "hash",
      ctaText: "Voir l’adresse postale",
      modalHeader: "Ton courrier doit être adressé à",
    },
    {
      texte: "Autre",
      logo: "alert-triangle",
      label1:
        "Indiquez en deux mots le type de démarche que vous demandez à l’usager :",
      label2: null,
      placeholder1: "Type de démarche",
      placeholder2:
        "Expliquez maintenant les détails de l’action à réaliser pour réaliser l’étape",
      ctaText: "Bouton personnalisé",
      modalHeader: "Ce que tu dois faire",
    },
  ],
  timeSteps: [
    { texte: "secondes" },
    { texte: "minutes" },
    { texte: "heures" },
    { texte: "jours" },
    { texte: "mois" },
    { texte: "ans" },
  ],
  papiers: [
    { texte: "Acte de naissance" },
    { texte: "Attestation CAF" },
    { texte: "Attestation CMU-C" },
    { texte: "Attestation de diplôme ou d’équivalence" },
    { texte: "Avis de taxe foncière" },
    { texte: "Avis d’imposition" },
    { texte: "Carte de bénéficiaire de l’AME" },
    { texte: "Carte de mutuelle" },
    { texte: "Carte de résident" },
    { texte: "Carte Vitale" },
    { texte: "Curriculum Vitae (CV)" },
    { texte: "Justificatif d’abonnement transport" },
    { texte: "Justificatif de domicile" },
    { texte: "Passeport" },
    { texte: "Permis de conduire" },
    { texte: "Récépissé de la demande d’asile" },
    { texte: "Récépissé de demande de titre de séjour " },
    { texte: "Relevé d’identité bancaire (RIB)" },
    { texte: "Titre de séjour" },
  ],
};

const customConvertOption = {
  blockToHTML: (block: any) => {
    if (block.type === "header-six") { // "Bon à savoir" block
      return {
        start:
          "<div class='bloc-rouge'> <div class='icon-left-side'> <span>i</span> </div> <div class='right-side'> <div><b>Bon à savoir :</b></div>",
        end: "</div> </div>",
      };
    }
    return null;
  },
  entityToHTML: (entity: any, originalText: string) => {
    if (entity.type === "link" || entity.type === "LINK") {
      return (
        <a
          href={entity.data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="edited-btn"
        >
          {h2p(originalText)}
        </a>
      );
    } else if (entity.type === "image" || entity.type === "IMAGE") {
      return (
        <div className="image-wrapper">
          <Image {...entity.data} alt={(entity.data || {}).alt} />
        </div>
      );
    }
    return originalText;
  },
};

const google_localities = [
  "administrative_area_level_1",
  "administrative_area_level_2",
  "administrative_area_level_3",
  "administrative_area_level_4",
  "administrative_area_level_5",
  "locality",
  "sublocality",
  "sublocality_level_1",
  "sublocality_level_2",
  "sublocality_level_3",
  "sublocality_level_4",
  "sublocality_level_5",
  "neighborhood",
];

// to use when streamline icon is installed
// const streamlineIconCorrespondency = [
//   { titleIcon: "alert-triangle-outline", streamlineIcon: Alerts.AlertTriangle },
//   {
//     titleIcon: "papiers",
//     streamlineIcon:
//       GeometricFullBodySingleUserActionsNeutral.SingleNeutralActionsCheck2,
//     evaIcon: "person-outline",
//   },
//   { titleIcon: "calendar-outline", streamlineIcon: Family.FamilyChild },
//   { titleIcon: "clock-outline", streamlineIcon: Time.TimeClockCircle1 },
//   {
//     titleIcon: "frBubble",
//     streamlineIcon: Conversation.ConversationChat1,
//     evaIcon: "message-circle-outline",
//   },
//   {
//     titleIcon: "pricetags-outline",
//     streamlineIcon: Currencies.CurrencyEuroCircle,
//   },
// ];

const streamlineIconCorrespondency = [
  { titleIcon: "alert-triangle-outline" },
  {
    titleIcon: "papiers",
    evaIcon: "person-outline",
  },
  { titleIcon: "calendar-outline" },
  { titleIcon: "clock-outline" },
  {
    titleIcon: "frBubble",
    evaIcon: "message-circle-outline",
  },
  {
    titleIcon: "pricetags-outline",
  },
  {
    titleIcon: "pin-outline",
  },
];

export {
  contenu,
  menu,
  filtres,
  onBoardSteps,
  importantCard,
  showModals,
  menuDemarche,
  demarcheSteps,
  customConvertOption,
  google_localities,
  cardTitlesDispositif,
  streamlineIconCorrespondency,
  cardTitlesDemarche,
  infocardsDemarcheTitles,
  infocardFranceEntiere,
};
