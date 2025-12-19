import mongoose from "mongoose";

/**
 * Centralized test schemas for MongoDB testing
 * This module provides consistent schemas across all test files
 */

// Theme schema - minimal version for testing
export const ThemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: Number, required: true },
  },
  { collection: "themes" },
);

// Need schema - minimal version for testing
export const NeedSchema = new mongoose.Schema(
  {
    theme: { type: mongoose.Schema.Types.ObjectId, ref: "Theme", required: true },
    name: { type: String },
  },
  { collection: "needs" },
);

// Dispositif schema - minimal version for testing with essential fields
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
      vues: Number,
      updatedAt: Date,
      frenchLevel: [{ type: String, enum: ["alpha", "A1", "A2", "B1", "B2", "C1", "C2"] }],
      public: [{ type: String, enum: ["family", "women", "youths", "senior", "gender"] }],
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
    translations: { type: mongoose.Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["Actif", "Archivé", "Brouillon", "En attente", "En attente admin", "Supprimé"],
      default: "Actif",
    },
    typeContenu: {
      type: String,
      enum: ["dispositif", "demarche", "online"],
      default: "dispositif",
    },
    title: { type: String },
    name: { type: String },
    titreMarque: { type: String },
    abstract: { type: String },
    sponsorName: { type: String },
  },
  { collection: "dispositifs" },
);

// Schema registry for easy access to all test schemas
export const TestSchemas = {
  Theme: ThemeSchema,
  Need: NeedSchema,
  Dispositif: DispositifSchema,
};

// Model names registry
export const ModelNames = {
  Theme: "Theme",
  Need: "Need",
  Dispositif: "Dispositif",
} as const;

// Helper function to register all schemas on a connection
export const registerTestSchemas = (conn: mongoose.Connection) => {
  conn.model(ModelNames.Theme, TestSchemas.Theme);
  conn.model(ModelNames.Need, TestSchemas.Need);
  conn.model(ModelNames.Dispositif, TestSchemas.Dispositif);
  return {
    Theme: conn.model(ModelNames.Theme),
    Need: conn.model(ModelNames.Need),
    Dispositif: conn.model(ModelNames.Dispositif),
  };
};
