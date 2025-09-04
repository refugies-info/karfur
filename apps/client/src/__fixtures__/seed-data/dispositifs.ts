import type { Connection } from "mongoose";
import mongoose from "mongoose";
import { getOrRegisterModel } from "~/__fixtures__/search/helpers";
import type { SeedIds } from "~/__fixtures__/seed-data/themes-and-needs";

export const seedDispositifs = async (conn: Connection, ids: SeedIds) => {
  const { themeA, themeB, needA1, needA2, needB1 } = ids as any;
  const themeC = (ids as any).themeC as mongoose.Types.ObjectId | undefined;
  const Dispositif = conn.model("Dispositif");

  // Create theme documents with positions for theme sorting
  // Only create theme documents if Theme model exists (for search index testing)
  try {
    const ThemeModel = getOrRegisterModel(
      conn,
      "Theme",
      new mongoose.Schema({}, { strict: false, collection: "themes" }),
    );
    if (ThemeModel) {
      await ThemeModel.insertMany([
        { _id: themeA, position: 1, name: "Langues et intégration" },
        { _id: themeB, position: 3, name: "Numérique et compétences" },
        { _id: themeC, position: 2, name: "Emploi et formation" },
      ]);
    }
  } catch (error) {
    // Theme model doesn't exist in legacy tests, skip theme creation gracefully
    // This is expected behavior for legacy tests that don't register the Theme model
  }

  // Create needs documents for the aggregation pipeline lookup
  // Important: conn.model("Need") throws if not registered; make sure we register a minimal model
  try {
    const NeedModel = getOrRegisterModel(conn, "Need", new mongoose.Schema({}, { strict: false, collection: "needs" }));
    await NeedModel.insertMany([
      { _id: needA1, theme: themeA },
      { _id: needA2, theme: themeA },
      { _id: needB1, theme: themeB },
    ]);
  } catch (error) {
    // Handle any errors in needs creation without failing the seed step
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
    // Distribute needs to match expected legacy counts: needA1=8, needA2=2, needB1=2
    ...Array.from({ length: 18 }, (_, i) => {
      let theme: mongoose.Types.ObjectId;
      let needs: mongoose.Types.ObjectId[];

      if (i < 3) {
        // needA1 belongs to themeA, so use themeA
        theme = themeA;
        needs = [needA1];
      } else if (i < 5) {
        // needA2 belongs to themeA, so use themeA
        theme = themeA;
        needs = [needA2];
      } else if (i < 7) {
        // needB1 belongs to themeB, so use themeB
        theme = themeB;
        needs = [needB1];
      } else {
        // No needs for remaining items, use any theme
        theme = i % 3 === 0 ? themeA : i % 3 === 1 ? themeB : themeC;
        needs = [];
      }

      return {
        theme,
        needs,
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
      };
    }),
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
