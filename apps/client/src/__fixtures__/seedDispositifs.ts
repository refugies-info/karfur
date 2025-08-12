import type { Connection } from "mongoose";
import mongoose from "mongoose";

export interface SeedIds {
  themeA: mongoose.Types.ObjectId;
  themeB: mongoose.Types.ObjectId;
  themeC: mongoose.Types.ObjectId;
  needA1: mongoose.Types.ObjectId;
  needA2: mongoose.Types.ObjectId;
  needB1: mongoose.Types.ObjectId;
}

// Minimal Dispositif schema containing only fields needed by filters/aggregations
export const DispositifSchema = new mongoose.Schema(
  {
    // Fields used by buildBaseMatch(): theme, secondaryThemes, needs
    theme: { type: mongoose.Schema.Types.ObjectId, ref: "Theme" },
    secondaryThemes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Theme" }],
    needs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Need" }],
    metadatas: {
      location: {
        type: String,
        enum: [
          "1 - Ain",
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
          "2 - Aisne",
          "21 - Côte-d'Or",
          "22 - Côtes-d'Armor",
          "23 - Creuse",
          "24 - Dordogne",
          "25 - Doubs",
          "26 - Drôme",
          "27 - Eure",
          "28 - Eure-et-Loir",
          "29 - Finistère",
          "3 - Allier",
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
          "4 - Alpes-de-Haute-Provence",
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
          "5 - Hautes-Alpes",
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
          "6 - Alpes-Maritimes",
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
          "7 - Ardèche",
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
          "9 - Ariège",
          "90 - Territoire de Belfort",
          "91 - Essonne",
          "92 - Hauts-de-Seine",
          "93 - Seine-Saint-Denis",
          "94 - Val-de-Marne",
          "95 - Val-d'Oise",
          "france",
          "online",
        ],
      },
      frenchLevel: [{ type: String, enum: ["alpha", "A1", "A2", "B1", "B2", "C1", "C2"] }],
      public: [{ type: String, enum: ["family", "women", "youths", "senior", "gender"] }],
      // Field used by counts.ts to filter refugee statuses
      publicStatus: [
        {
          type: String,
          enum: ["apatride", "asile", "french", "refugie", "subsidiaire", "temporaire"],
        },
      ],
      age: {
        type: { type: String, enum: ["between", "moreThan", "lessThan"] },
        ages: [Number],
      },
    },
    // Used by counts.ts to facet languages: presence of translations.<lang>
    translations: { type: mongoose.Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["Actif", "Archivé", "Brouillon", "En attente", "En attente admin", "Supprimé"],
      default: "Actif",
    },
    typeContenu: { type: String, enum: ["dispositif", "demarche", "online"], default: "dispositif" },
    // Minimal set of text attributes that Algolia indexes in production (simplified)
    // These are added to support search simulation in tests/arbitraries
    title: { type: String },
    name: { type: String },
    titreMarque: { type: String },
    abstract: { type: String },
    sponsorName: { type: String },
  },
  { collection: "dispositifs" },
);

export const makeSeedIds = (): SeedIds => ({
  themeA: new mongoose.Types.ObjectId("64a0000000000000000000a1"),
  themeB: new mongoose.Types.ObjectId("64a0000000000000000000b2"),
  // Added an extra theme to allow up to two secondary themes
  // Note: SeedIds type should include this if referenced elsewhere
  // We only use it locally for seeds normalization below
  themeC: new mongoose.Types.ObjectId("64a0000000000000000000c3"),
  needA1: new mongoose.Types.ObjectId("64b0000000000000000000a1"),
  needA2: new mongoose.Types.ObjectId("64b0000000000000000000a2"),
  needB1: new mongoose.Types.ObjectId("64b0000000000000000000b1"),
});

export const seedDispositifs = async (conn: Connection, ids: SeedIds) => {
  const { themeA, themeB, needA1, needA2, needB1 } = ids as any;
  const themeC = (ids as any).themeC as mongoose.Types.ObjectId | undefined;
  const Dispositif = conn.model("Dispositif");
  const base = [
    // Paris (75), FR/EN, public: [jeunes], french A1, themeA, needs [A1,A2], age 16-25
    {
      theme: themeA,
      needs: [needA1, needA2],
      secondaryThemes: [themeB],
      title: "Cours de français A1 pour jeunes à Paris",
      name: "Association Langues Paris",
      titreMarque: "Langues&Co",
      abstract: "Ateliers hebdomadaires de français niveau débutant pour les 16-25 ans.",
      sponsorName: "Ville de Paris",
      metadatas: {
        location: "75 - Paris",
        frenchLevel: ["A1"],
        public: ["youths"],
        publicStatus: ["asile", "refugie"],
        age: { type: "between", ages: [16, 25] },
      },
      translations: {
        en: {
          title: "French A1 course for young people in Paris",
          abstract: "Weekly French classes for beginners for young people aged 16-25.",
        },
        fr: {
          title: "Cours de français A1 pour jeunes à Paris",
          abstract: "Ateliers hebdomadaires de français niveau débutant pour les 16-25 ans.",
        },
      },
      status: "Actif",
      typeContenu: "dispositif",
    },
    // Hauts-de-Seine (92), FR only, public: [familles], french B1, themeA, needs [A1], age 26-64
    {
      theme: themeA,
      needs: [needA1],
      secondaryThemes: [],
      title: "Accompagnement administratif B1 pour familles",
      name: "Solidarité 92",
      titreMarque: "Plateforme Familles",
      abstract: "Aide aux démarches et cours de français intermédiaire B1.",
      sponsorName: "Département des Hauts-de-Seine",
      metadatas: {
        location: "92 - Hauts-de-Seine",
        frenchLevel: ["B1"],
        public: ["family"],
        publicStatus: ["subsidiaire"],
        age: { type: "between", ages: [26, 64] },
      },
      translations: {
        fr: {
          title: "Accompagnement administratif B1 pour familles",
          abstract: "Aide aux démarches et cours de français intermédiaire B1.",
        },
      },
      status: "Actif",
      typeContenu: "dispositif",
    },
    // Paris (75), FR, public: [seniors], french A2, themeB, needs [B1], age 65+
    {
      theme: themeB,
      needs: [needB1],
      secondaryThemes: [themeA],
      title: "Atelier numérique A2 pour seniors",
      name: "Maison des Seniors Paris",
      titreMarque: "Seniors Connectés",
      abstract: "Découverte du numérique et cours de français niveau A2.",
      sponsorName: "Fondation Bien Vieillir",
      metadatas: {
        location: "75 - Paris",
        frenchLevel: ["A2"],
        public: ["senior"],
        publicStatus: ["apatride", "temporaire"],
        age: { type: "moreThan", ages: [65] },
      },
      translations: {
        fr: {
          title: "Atelier numérique A2 pour seniors",
          abstract: "Découverte du numérique et cours de français niveau A2.",
        },
      },
      status: "Actif",
      typeContenu: "dispositif",
    },
    // Inactive entry should be filtered out globally
    {
      theme: themeB,
      needs: [needB1],
      secondaryThemes: [],
      metadatas: {
        location: "75 - Paris",
        frenchLevel: ["A1"],
        public: ["youths"],
        publicStatus: ["french"],
        age: { type: "between", ages: [18, 25] },
      },
      translations: {
        fr: {
          title: "Cours de français A1 pour jeunes à Paris",
          abstract: "Ateliers hebdomadaires de français niveau débutant pour les 16-25 ans.",
        },
      },
      status: "Archivé",
      typeContenu: "dispositif",
    },
  ];

  await Dispositif.insertMany(base);
};

export const makeNeedsList = (ids: SeedIds) => [
  { _id: ids.needA1, theme: { _id: ids.themeA } },
  { _id: ids.needA2, theme: { _id: ids.themeA } },
  { _id: ids.needB1, theme: { _id: ids.themeB } },
];
