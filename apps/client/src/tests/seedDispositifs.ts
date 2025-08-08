import type { Connection, Schema } from "mongoose";
import mongoose from "mongoose";

export interface SeedIds {
  themeA: mongoose.Types.ObjectId;
  themeB: mongoose.Types.ObjectId;
  needA1: mongoose.Types.ObjectId;
  needA2: mongoose.Types.ObjectId;
  needB1: mongoose.Types.ObjectId;
} 

export const seedDispositifs = async (conn: Connection, ids: SeedIds) => {
  const { themeA, themeB, needA1, needA2, needB1 } = ids;
  const Dispositif = conn.model("Dispositif");
  await Dispositif.insertMany([
    // Paris (75), FR/EN, public: [jeunes], french A1, themeA, needs [A1,A2], age 16-25
    {
      thematiques: [themeA],
      besoins: [needA1, needA2],
      metadatas: { location: "75", frenchLevel: ["A1"], public: ["jeunes"], age: { from: 16, to: 25 } },
      availableLanguages: ["fr", "en"],
      status: "Actif",
      typeContenu: "dispositif",
    },
    // Hauts-de-Seine (92), FR only, public: [familles], french B1, themeA, needs [A1], age 26-64
    {
      thematiques: [themeA],
      besoins: [needA1],
      metadatas: { location: "92", frenchLevel: ["B1"], public: ["familles"], age: { from: 26, to: 64 } },
      availableLanguages: ["fr"],
      status: "Actif",
      typeContenu: "dispositif",
    },
    // Paris (75), FR, public: [seniors], french A2, themeB, needs [B1], age 65+
    {
      thematiques: [themeB],
      besoins: [needB1],
      metadatas: { location: "75", frenchLevel: ["A2"], public: ["seniors"], age: { from: 65, to: 90 } },
      availableLanguages: ["fr"],
      status: "Actif",
      typeContenu: "dispositif",
    },
    // Inactive entry should be filtered out globally
    {
      thematiques: [themeB],
      besoins: [needB1],
      metadatas: { location: "75", frenchLevel: ["A1"], public: ["adultes"], age: { from: 18, to: 25 } },
      availableLanguages: ["fr"],
      status: "Inactif",
      typeContenu: "dispositif",
    },
  ]);
};
