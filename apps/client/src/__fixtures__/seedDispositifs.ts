import type { Connection } from "mongoose";
import mongoose from "mongoose";

export interface SeedIds {
  themeA: mongoose.Types.ObjectId;
  themeB: mongoose.Types.ObjectId;
  needA1: mongoose.Types.ObjectId;
  needA2: mongoose.Types.ObjectId;
  needB1: mongoose.Types.ObjectId;
}

// Minimal Dispositif schema containing only fields needed by filters/aggregations
export const DispositifSchema = new mongoose.Schema(
  {
    thematiques: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thematique" }],
    besoins: [{ type: mongoose.Schema.Types.ObjectId, ref: "Besoin" }],
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
      frenchLevel: [{ type: String, enum: ["A1", "A2", "B1", "B2", "C1", "C2"] }],
      public: [{ type: String }],
      age: {
        from: { type: Number },
        to: { type: Number },
      },
    },
    availableLanguages: [{ type: String }],
    status: {
      type: String,
      enum: ["Actif", "Archivé", "Brouillon", "En attente", "En attente admin", "Supprimé"],
      default: "Actif",
    },
    typeContenu: { type: String, enum: ["dispositif", "demarche", "online"], default: "dispositif" },
  },
  { collection: "dispositifs" },
);

export const makeSeedIds = (): SeedIds => ({
  themeA: new mongoose.Types.ObjectId("64a0000000000000000000a1"),
  themeB: new mongoose.Types.ObjectId("64a0000000000000000000b2"),
  needA1: new mongoose.Types.ObjectId("64b0000000000000000000a1"),
  needA2: new mongoose.Types.ObjectId("64b0000000000000000000a2"),
  needB1: new mongoose.Types.ObjectId("64b0000000000000000000b1"),
});

export const seedDispositifs = async (conn: Connection, ids: SeedIds) => {
  const { themeA, themeB, needA1, needA2, needB1 } = ids;
  const Dispositif = conn.model("Dispositif");
  await Dispositif.insertMany([
    // Paris (75), FR/EN, public: [jeunes], french A1, themeA, needs [A1,A2], age 16-25
    {
      thematiques: [themeA],
      besoins: [needA1, needA2],
      metadatas: { location: "75 - Paris", frenchLevel: ["A1"], public: ["jeunes"], age: { from: 16, to: 25 } },
      availableLanguages: ["fr", "en"],
      status: "Actif",
      typeContenu: "dispositif",
    },
    // Hauts-de-Seine (92), FR only, public: [familles], french B1, themeA, needs [A1], age 26-64
    {
      thematiques: [themeA],
      besoins: [needA1],
      metadatas: {
        location: "92 - Hauts-de-Seine",
        frenchLevel: ["B1"],
        public: ["familles"],
        age: { from: 26, to: 64 },
      },
      availableLanguages: ["fr"],
      status: "Actif",
      typeContenu: "dispositif",
    },
    // Paris (75), FR, public: [seniors], french A2, themeB, needs [B1], age 65+
    {
      thematiques: [themeB],
      besoins: [needB1],
      metadatas: { location: "75 - Paris", frenchLevel: ["A2"], public: ["seniors"], age: { from: 65, to: 90 } },
      availableLanguages: ["fr"],
      status: "Actif",
      typeContenu: "dispositif",
    },
    // Inactive entry should be filtered out globally
    {
      thematiques: [themeB],
      besoins: [needB1],
      metadatas: { location: "75 - Paris", frenchLevel: ["A1"], public: ["adultes"], age: { from: 18, to: 25 } },
      availableLanguages: ["fr"],
      status: "Archivé",
      typeContenu: "dispositif",
    },
  ]);
};

export const makeNeedsList = (ids: SeedIds) => [
  { _id: ids.needA1, theme: { _id: ids.themeA } },
  { _id: ids.needA2, theme: { _id: ids.themeA } },
  { _id: ids.needB1, theme: { _id: ids.themeB } },
];
