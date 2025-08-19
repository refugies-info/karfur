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
      vues: Number,
      updatedAt: Date,
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

  // Create theme documents with positions for theme sorting
  // Only create theme documents if Theme model exists (for search index testing)
  try {
    const Theme = conn.model("Theme");
    if (Theme) {
      await Theme.insertMany([
        { _id: themeA, position: 1, name: "Langues et intégration" },
        { _id: themeB, position: 3, name: "Numérique et compétences" },
        { _id: themeC, position: 2, name: "Emploi et formation" },
      ]);
    }
  } catch (error) {
    // Theme model doesn't exist in legacy tests, skip theme creation gracefully
    // This is expected behavior for legacy tests that don't register the Theme model
  }

  const base = [
    // Enhanced existing items with views and timestamps
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
        age: { type: "between", ages: [0, 17] },
        vues: 150,
        updatedAt: new Date("2024-01-15"),
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
        age: { type: "between", ages: [18, 25] },
        vues: 89,
        updatedAt: new Date("2024-02-20"),
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
        age: { type: "moreThan", ages: [24] },
        vues: 234,
        updatedAt: new Date("2024-03-10"),
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
    // Additional items for comprehensive testing
    {
      theme: themeC,
      needs: [needB1],
      secondaryThemes: [themeA, themeB],
      title: "Formation professionnelle en ligne",
      name: "Centre de Formation Digital",
      titreMarque: "Digital Pro",
      abstract: "Cours professionnels en ligne pour adultes.",
      sponsorName: "Région Île-de-France",
      metadatas: {
        location: "online",
        frenchLevel: ["B2"],
        public: ["family", "senior"],
        publicStatus: ["french"],
        age: { type: "between", ages: [25, 64] },
        vues: 567,
        updatedAt: new Date("2024-01-30"),
      },
      translations: {
        fr: { title: "Formation professionnelle en ligne", abstract: "Cours professionnels en ligne pour adultes." },
        en: { title: "Online professional training", abstract: "Professional online courses for adults." },
      },
      status: "Actif",
      typeContenu: "online",
    },
    {
      theme: themeA,
      needs: [needA2],
      secondaryThemes: [themeC],
      title: "Démarche administrative en ligne",
      name: "Service Démarches",
      titreMarque: "Admin Express",
      abstract: "Guide en ligne pour démarches administratives.",
      sponsorName: "État français",
      metadatas: {
        location: "online",
        frenchLevel: ["A2", "B1"],
        public: ["family"],
        publicStatus: ["asile", "refugie", "subsidiaire"],
        age: { type: "moreThan", ages: [17] },
        vues: 1234,
        updatedAt: new Date("2024-03-05"),
      },
      translations: {
        fr: { title: "Démarche administrative en ligne", abstract: "Guide en ligne pour démarches administratives." },
      },
      status: "Actif",
      typeContenu: "demarche",
    },
    // Edge case items
    {
      theme: themeB,
      needs: [needA1],
      title: "Cours intensif C1 pour professionnels",
      name: "Institut Linguistique",
      titreMarque: "Pro Lingua",
      abstract: "Formation intensive niveau avancé pour cadres.",
      sponsorName: "Entreprise Plus",
      metadatas: {
        location: "13 - Bouches-du-Rhône",
        frenchLevel: ["C1"],
        public: ["family"],
        publicStatus: ["french"],
        age: { type: "between", ages: [25, 65] },
        vues: 45,
        updatedAt: new Date("2024-02-28"),
      },
      translations: {
        fr: {
          title: "Cours intensif C1 pour professionnels",
          abstract: "Formation intensive niveau avancé pour cadres.",
        },
      },
      status: "Actif",
      typeContenu: "dispositif",
    },
    // Pagination test items (create 20+ items)
    ...Array.from({ length: 18 }, (_, i) => ({
      theme: i % 3 === 0 ? themeA : i % 3 === 1 ? themeB : themeC,
      needs: [needA1],
      title: `Formation ${i + 6} - ${i % 2 === 0 ? "Paris" : "Lyon"}`,
      name: `Organisation ${String.fromCharCode(65 + i)}`,
      titreMarque: `Brand ${i + 1}`,
      abstract: `Description de la formation ${i + 6}`,
      sponsorName: `Sponsor ${i + 1}`,
      metadatas: {
        location: i % 2 === 0 ? "75 - Paris" : "69 - Rhône",
        frenchLevel: [i % 4 === 0 ? "A1" : i % 4 === 1 ? "A2" : i % 4 === 2 ? "B1" : "B2"],
        public: [i % 3 === 0 ? "youths" : i % 3 === 1 ? "family" : "senior"],
        publicStatus: ["asile"],
        age: { type: "between", ages: [18, 25] },
        vues: 50 + i * 10,
        updatedAt: new Date(2024, 2, 15 + i),
      },
      translations: {
        fr: { title: `Formation ${i + 6}`, abstract: `Description de la formation ${i + 6}` },
      },
      status: "Actif",
      typeContenu: i % 3 === 0 ? "dispositif" : i % 3 === 1 ? "demarche" : "online",
    })),
    // Inactive entry should be filtered out globally
    {
      theme: themeB,
      needs: [needB1],
      secondaryThemes: [],
      title: "Cours de français A1 pour jeunes à Paris",
      name: "Association Langues Paris",
      titreMarque: "Langues&Co",
      abstract: "Ateliers hebdomadaires de français niveau débutant pour les 16-25 ans.",
      sponsorName: "Ville de Paris",
      metadatas: {
        location: "75 - Paris",
        frenchLevel: ["A1"],
        public: ["youths"],
        publicStatus: ["french"],
        age: { type: "between", ages: [18, 25] },
        vues: 100,
        updatedAt: new Date("2024-01-01"),
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
