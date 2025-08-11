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
  // expose the mock so tests can reconfigure behavior per-connection
  return { searchClient, __mockSearchSingleIndex: mockSearchSingleIndex };
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

    // Configure Algolia mock to search in Mongo across simplified indexed fields
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const algoliaMock = require("@algolia/client-search") as any;
    const reindex = async (q: string) => {
      const Dispositif = conn.model("Dispositif");
      if (!q) {
        // No query -> Algolia not used, return empty hits to let Mongo-only filtering run
        return [] as { objectID: string }[];
      }
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const docs = await Dispositif.find(
        {
          status: "Actif",
          $or: [
            { title: { $regex: rx } },
            { name: { $regex: rx } },
            { titreMarque: { $regex: rx } },
            { abstract: { $regex: rx } },
            { sponsorName: { $regex: rx } },
          ],
        },
        { _id: 1 },
      ).lean();
      return docs.map((d: any) => ({ objectID: String(d._id) }));
    };
    algoliaMock.__mockSearchSingleIndex.mockImplementation(async (args: any) => {
      const query: string | undefined = args?.searchParams?.query;
      const hits = await reindex(query || "");
      return { hits };
    });
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
    search: "",
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

  // Helper to register a suite of facet comparison tests from a list of cases
  const runFacetTests = (
    cases: Array<{
      name: string;
      params: Partial<QueryParams>;
      legacy: Partial<LegacyQuery>;
    }>,
  ) => {
    for (const c of cases) {
      test(c.name, async () => {
        const params = toParams(c.params);
        const api = await computeSearchCounts(conn, params);

        const all = await getAllDispositifs();
        const legacy = legacyFacetCounts(all as any, needsList, toLegacyQuery(c.legacy));

        expectCountsEqual(api, legacy);
      });
    }
  };

  // Helper to avoid duplicating params as legacy for each case
  const makeCase = (name: string, params: Partial<QueryParams>) =>
    ({ name, params, legacy: params as Partial<LegacyQuery> });

  runFacetTests([
    makeCase("baseline: totals and facets match (no filters)", {}),
    makeCase("departments facet matches legacy when department filter applied (skip location)", { departments: ["75"] }),
    makeCase("frenchLevel facet matches legacy when frenchLevel filter applied (skip frenchLevel)", { frenchLevel: ["a"] }),
    makeCase("language facet matches legacy when language filter applied (skip language)", { language: ["fr"] }),
    makeCase("public facet matches legacy when public filter applied (skip public)", { public: ["family"] }),
    makeCase("status facet matches legacy when status filter applied (skip status)", { status: ["refugie"] }),
    makeCase("themes facet matches legacy when theme filter applied (skip theme)", { themes: [ids.themeB.toString()] }),
    // Include the corresponding theme to mirror legacy behavior where needs are evaluated within the selected theme
    makeCase("needs facet matches legacy when needs filter applied (skip needs)", { themes: [ids.themeB.toString()], needs: [ids.needB1.toString()] }),
    makeCase("search facet matches legacy when search filter applied (skip search)", { search: "jeunes" }),
  ]);

  // *******************************************************
  // Randomized dataset using fast-check generated documents
  // *******************************************************
  describe("randomized dataset (fast-check)", () => {
    beforeEach(async () => {
      const db = conn.db;
      if (!db) throw new Error("Connection DB not initialized");
      await db.dropDatabase();
      // Seed many random documents for broader coverage. Seed ensures determinism across runs.
      await seedRandomDispositifs(conn, ids, 500, 12345);
    });

    runFacetTests([
      // No parameters
      makeCase("baseline: totals and facets match (no filters)", {}),

      // Single parameter
      makeCase("departments facet matches legacy when department filter applied (skip location)", { departments: ["75"] }),
      makeCase("frenchLevel facet matches legacy when frenchLevel filter applied (skip frenchLevel)", { frenchLevel: ["a"] }),
      makeCase("language facet matches legacy when language filter applied (skip language)", { language: ["fr"] }),
      makeCase("public facet matches legacy when public filter applied (skip public)", { public: ["family"] }),
      makeCase("status facet matches legacy when status filter applied (skip status)", { status: ["refugie"] }),
      makeCase("themes facet matches legacy when theme filter applied (skip theme)", { themes: ["6319f6b363ab2bbb162d7df5"] }),
      makeCase("needs facet matches legacy when needs filter applied (skip needs)", { needs: ["6319f6b363ab2bbb162d7df6"] }),

      // Search with single parameter
      makeCase("search facet matches legacy when search filter applied (skip search)", { search: "jeunes" }),
      makeCase("search facet matches legacy when search filter applied (skip search) + departments", { search: "jeunes", departments: ["75"] }),
      makeCase("search facet matches legacy when search filter applied (skip search) + frenchLevel", { search: "jeunes", frenchLevel: ["a"] }),
      makeCase("search facet matches legacy when search filter applied (skip search) + language", { search: "jeunes", language: ["fr"] }),
      makeCase("search facet matches legacy when search filter applied (skip search) + public", { search: "jeunes", public: ["family"] }),
      makeCase("search facet matches legacy when search filter applied (skip search) + status", { search: "jeunes", status: ["refugie"] }),
      makeCase("search facet matches legacy when search filter applied (skip search) + themes", { search: "jeunes", themes: ["6319f6b363ab2bbb162d7df5"] }),
      makeCase("search facet matches legacy when search filter applied (skip search) + needs", { search: "jeunes", needs: ["6319f6b363ab2bbb162d7df6"] }),

      // Two parameters
      makeCase("departments facet matches legacy when department filter applied (skip location)", { departments: ["75"], frenchLevel: ["a"] }),
      makeCase("frenchLevel facet matches legacy when frenchLevel filter applied (skip frenchLevel)", { frenchLevel: ["a"], language: ["fr"] }),
      makeCase("language facet matches legacy when language filter applied (skip language)", { language: ["fr"], public: ["family"] }),
      makeCase("public facet matches legacy when public filter applied (skip public)", { public: ["family"], status: ["refugie"] }),
      makeCase("status facet matches legacy when status filter applied (skip status)", { status: ["refugie"], themes: ["6319f6b363ab2bbb162d7df5"] }),
      makeCase("themes facet matches legacy when theme filter applied (skip theme)", { themes: ["6319f6b363ab2bbb162d7df5"], needs: ["6319f6b363ab2bbb162d7df6"] }),
      makeCase("needs facet matches legacy when needs filter applied (skip needs)", { needs: ["6319f6b363ab2bbb162d7df6"], search: "jeunes" }),

      // Search + other filters
      makeCase("search facet matches legacy when search filter applied (skip search) + departments + frenchLevel", { search: "jeunes", departments: ["75"], frenchLevel: ["a"] }),
      makeCase("search facet matches legacy when search filter applied (skip search) + departments + language", { search: "jeunes", departments: ["75"], language: ["fr"] }),
      makeCase("search facet matches legacy when search filter applied (skip search) + departments + public", { search: "jeunes", departments: ["75"], public: ["family"] }),
      makeCase("search facet matches legacy when search filter applied (skip search) + departments + status", { search: "jeunes", departments: ["75"], status: ["refugie"] }),
      makeCase("search facet matches legacy when search filter applied (skip search) + departments + themes", { search: "jeunes", departments: ["75"], themes: ["6319f6b363ab2bbb162d7df5"] }),
      makeCase("search facet matches legacy when search filter applied (skip search) + departments + needs", { search: "jeunes", departments: ["75"], needs: ["6319f6b363ab2bbb162d7df6"] }),
    ]);
  });
});
