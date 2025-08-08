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
      location: { type: String },
      frenchLevel: [{ type: String }],
      public: [{ type: String }],
      age: {
        from: { type: Number },
        to: { type: Number },
      },
    },
    availableLanguages: [{ type: String }],
    status: { type: String, default: "Actif" },
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

export const makeNeedsList = (ids: SeedIds) => [
  { _id: ids.needA1, theme: { _id: ids.themeA } },
  { _id: ids.needA2, theme: { _id: ids.themeA } },
  { _id: ids.needB1, theme: { _id: ids.themeB } },
];
