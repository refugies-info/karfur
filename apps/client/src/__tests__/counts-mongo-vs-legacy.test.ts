import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection } from "mongoose";
import { seedRandomDispositifs } from "~/__fixtures__/arbitraries/dispositif.arb";
import { legacyFacetCounts, LegacyNeedsItem, LegacyQuery } from "~/__fixtures__/legacyCounts";
import { DispositifSchema, makeNeedsList, makeSeedIds, seedDispositifs } from "~/__fixtures__/seedDispositifs";
import { computeSearchCounts, QueryParams } from "~/pages/api/search/counts";

// Mock Algolia client to reflect @algolia/client-search usage and avoid real network
jest.mock("@algolia/client-search", () => {
  const mockSearchSingleIndex = jest.fn().mockResolvedValue({ hits: [] });
  const searchClient = jest.fn(() => ({ searchSingleIndex: mockSearchSingleIndex }));
  return { searchClient };
});

describe("Mongo counts vs legacy filterDispositifs", () => {
  let mongod: MongoMemoryServer;
  let conn: Connection;

  const ids = makeSeedIds();
  const needsList: LegacyNeedsItem[] = makeNeedsList(ids) as any;

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
    await seedDispositifs(conn, ids);
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

  test("frenchLevel facet matches legacy when frenchLevel filter applied (skip frenchLevel)", async () => {
    const params = toParams({ frenchLevel: ["a"] });
    const api = await computeSearchCounts(conn, params);

    const all = await getAllDispositifs();
    const legacy = legacyFacetCounts(all as any, needsList, toLegacyQuery({ frenchLevel: ["a"] }));

    expectCountsEqual(api, legacy);
  });

  test("language facet matches legacy when language filter applied (skip language)", async () => {
    const params = toParams({ language: ["fr"] });
    const api = await computeSearchCounts(conn, params);

    const all = await getAllDispositifs();
    const legacy = legacyFacetCounts(all as any, needsList, toLegacyQuery({ language: ["fr"] }));

    expectCountsEqual(api, legacy);
  });

  // Randomized dataset using fast-check generated documents
  describe("randomized dataset (fast-check)", () => {
    beforeEach(async () => {
      const db = conn.db;
      if (!db) throw new Error("Connection DB not initialized");
      await db.dropDatabase();
      // Seed many random documents for broader coverage. Seed ensures determinism across runs.
      await seedRandomDispositifs(conn, ids, 500, 12345);
    });

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

    test("frenchLevel facet matches legacy when frenchLevel filter applied (skip frenchLevel)", async () => {
      const params = toParams({ frenchLevel: ["a"] });
      const api = await computeSearchCounts(conn, params);

      const all = await getAllDispositifs();
      const legacy = legacyFacetCounts(all as any, needsList, toLegacyQuery({ frenchLevel: ["a"] }));

      expectCountsEqual(api, legacy);
    });

    test("language facet matches legacy when language filter applied (skip language)", async () => {
      const params = toParams({ language: ["fr"] });
      const api = await computeSearchCounts(conn, params);

      const all = await getAllDispositifs();
      const legacy = legacyFacetCounts(all as any, needsList, toLegacyQuery({ language: ["fr"] }));

      expectCountsEqual(api, legacy);
    });
  });
});
