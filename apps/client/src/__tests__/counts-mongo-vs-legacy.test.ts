import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection, Schema } from "mongoose";
import { computeSearchCounts, QueryParams } from "~/pages/api/search/counts";
import { legacyFacetCounts, LegacyNeedsItem, LegacyQuery } from "~/tests/legacyCounts";
import { seedDispositifs } from "~/tests/seedDispositifs";

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
    await seedDispositifs(conn, { themeA, themeB, needA1, needA2, needB1 });
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

  const expectCountsEqual = (api: any, legacy: any) => {
    expect(api.total).toBe(legacy.total);
    expect(Object.fromEntries(api.departments.map((x: any) => [x.id, x.count]))).toEqual(legacy.departments);
    expect(Object.fromEntries(api.languages.map((x: any) => [x.id, x.count]))).toEqual(legacy.languages);
    expect(Object.fromEntries(api.publics.map((x: any) => [x.id, x.count]))).toEqual(legacy.publics);
    expect(Object.fromEntries(api.statuses.map((x: any) => [x.id, x.count]))).toEqual(legacy.statuses);
    expect(Object.fromEntries(api.frenchLevels.map((x: any) => [x.id, x.count]))).toEqual(legacy.frenchLevels);
    expect(Object.fromEntries(api.ageRanges.map((x: any) => [x.id, x.count]))).toEqual(legacy.ageRanges);
    expect(Object.fromEntries(api.themes.map((x: any) => [x.id, x.count]))).toEqual(legacy.themes);
    expect(Object.fromEntries(api.needs.map((x: any) => [x.id, x.count]))).toEqual(legacy.needs);
  };

  const getAllDispositifs = async () => {
    const Dispositif = conn.model("Dispositif");
    return (await Dispositif.find({ status: "Actif" }).lean()).map((d: any) => ({
      ...d,
      _id: d._id.toString(),
      theme: d.thematiques?.[0]?.toString() ?? null,
      needs: (d.besoins || []).map((x: any) => x.toString()),
    }));
  };

  test("baseline: totals and facets match (no filters)", async () => {
    const params = toParams({});
    const api = await computeSearchCounts(conn, params);

    const all = await getAllDispositifs();
    const legacy = legacyFacetCounts(all as any, needsList, toLegacyQuery({}));

    expectCountsEqual(api, legacy);
  });

  test("departments facet matches legacy when department filter applied (skip location)", async () => {
    const params = toParams({ departments: ["75"] });
    const api = await computeSearchCounts(conn, params);

    const all = await getAllDispositifs();
    const legacy = legacyFacetCounts(all as any, needsList, toLegacyQuery({ departments: ["75"] }));

    expectCountsEqual(api, legacy);
  });
});
