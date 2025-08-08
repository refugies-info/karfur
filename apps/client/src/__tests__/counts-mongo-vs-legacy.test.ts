import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection, Schema } from "mongoose";
import { computeSearchCounts, QueryParams } from "~/pages/api/search/counts";
import { legacyFacetCounts, LegacyNeedsItem, LegacyQuery } from "~/tests/legacyCounts";

// Mock Algolia client to reflect @algolia/client-search usage and avoid real network
jest.mock("@algolia/client-search", () => {
  const mockSearchSingleIndex = jest.fn().mockResolvedValue({ hits: [] });
  const searchClient = jest.fn(() => ({ searchSingleIndex: mockSearchSingleIndex }));
  return { searchClient };
});

const O = (id: string) => new mongoose.Types.ObjectId(id);

// Minimal Dispositif schema containing only fields needed by filters/aggregations
const DispositifSchema = new Schema(
  {
    thematiques: [{ type: Schema.Types.ObjectId, ref: "Thematique" }],
    besoins: [{ type: Schema.Types.ObjectId, ref: "Besoin" }],
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

describe("Mongo counts vs legacy filterDispositifs", () => {
  let mongod: MongoMemoryServer;
  let conn: Connection;

  const themeA = O("64a0000000000000000000a1");
  const themeB = O("64a0000000000000000000b2");
  const needA1 = O("64b0000000000000000000a1");
  const needA2 = O("64b0000000000000000000a2");
  const needB1 = O("64b0000000000000000000b1");

  const needsList: LegacyNeedsItem[] = [
    { _id: needA1 as any, theme: { _id: themeA as any } },
    { _id: needA2 as any, theme: { _id: themeA as any } },
    { _id: needB1 as any, theme: { _id: themeB as any } },
  ];

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    conn = await mongoose.createConnection(mongod.getUri(), { dbName: "test" }).asPromise();
    // register model on this connection
    conn.model("Dispositif", DispositifSchema);
  });

  afterAll(async () => {
    await conn?.close();
    await mongod?.stop();
  });

  beforeEach(async () => {
    const db = conn.db;
    if (!db) throw new Error("Connection DB not initialized");
    await db.dropDatabase();

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
  });

  const toLegacyQuery = (p: Partial<LegacyQuery>): LegacyQuery => ({
    search: "",
    themes: [],
    needs: [],
    departments: [],
    age: [],
    frenchLevel: [],
    public: [],
    status: [],
    language: [],
    ...p,
  });

  const toParams = (p: Partial<QueryParams>): QueryParams => ({
    departments: [],
    themes: [],
    needs: [],
    age: [],
    frenchLevel: [],
    public: [],
    status: [],
    language: [],
    ...p,
  });

  test("baseline: totals and facets match (no filters)", async () => {
    const params = toParams({});
    const api = await computeSearchCounts(conn, params);

    const Dispositif = conn.model("Dispositif");
    const all = (await Dispositif.find({ status: "Actif" }).lean()).map((d: any) => ({
      ...d,
      _id: d._id.toString(),
      theme: d.thematiques?.[0]?.toString() ?? null,
      needs: (d.besoins || []).map((x: any) => x.toString()),
    }));
    const legacy = legacyFacetCounts(all as any, needsList, toLegacyQuery({}));

    expect(api.total).toBe(legacy.total);
    expect(Object.fromEntries(api.departments.map((x) => [x.id, x.count]))).toEqual(legacy.departments);
    expect(Object.fromEntries(api.languages.map((x) => [x.id, x.count]))).toEqual(legacy.languages);
    expect(Object.fromEntries(api.publics.map((x) => [x.id, x.count]))).toEqual(legacy.publics);
    expect(Object.fromEntries(api.statuses.map((x) => [x.id, x.count]))).toEqual(legacy.statuses);
    expect(Object.fromEntries(api.frenchLevels.map((x) => [x.id, x.count]))).toEqual(legacy.frenchLevels);
    expect(Object.fromEntries(api.ageRanges.map((x) => [x.id, x.count]))).toEqual(legacy.ageRanges);
    expect(Object.fromEntries(api.themes.map((x) => [x.id, x.count]))).toEqual(legacy.themes);
    expect(Object.fromEntries(api.needs.map((x) => [x.id, x.count]))).toEqual(legacy.needs);
  });
});
