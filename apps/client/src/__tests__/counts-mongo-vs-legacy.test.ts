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

  // Title helpers
  const singleTitles: Record<string, string> = {
    departments: "departments facet matches legacy when department filter applied (skip location)",
    frenchLevel: "frenchLevel facet matches legacy when frenchLevel filter applied (skip frenchLevel)",
    language: "language facet matches legacy when language filter applied (skip language)",
    public: "public facet matches legacy when public filter applied (skip public)",
    status: "status facet matches legacy when status filter applied (skip status)",
    themes: "themes facet matches legacy when theme filter applied (skip theme)",
    needs: "needs facet matches legacy when needs filter applied (skip needs)",
  } as const;

  type FiltersDef = Record<string, any[]>;

  // Generate test params from filters
  const generateCases = (options: {
    filters: FiltersDef;
    includeZero?: boolean;
    maxCombinationSize?: number; // number of distinct filters per case (1 = singles, 2 = pairs, 3 = triples ...)
    searchTerm?: string | null;
    // When true, the single "needs" case will also add the provided theme id in params
    needsSinglesIncludeThemeId?: string | null;
  }): Array<{ name: string; params: Partial<QueryParams> }> => {
    const {
      filters,
      includeZero = false,
      maxCombinationSize = 1,
      searchTerm = null,
      needsSinglesIncludeThemeId = null,
    } = options;

    const entries = Object.entries(filters);
    const cases: Array<{ name: string; params: Partial<QueryParams> }> = [];

    // helpers
    const kCombinations = <T,>(arr: T[], k: number): T[][] => {
      const res: T[][] = [];
      const backtrack = (start: number, combo: T[]) => {
        if (combo.length === k) {
          res.push(combo.slice());
          return;
        }
        for (let i = start; i < arr.length; i++) {
          combo.push(arr[i]);
          backtrack(i + 1, combo);
          combo.pop();
        }
      };
      if (k > 0) backtrack(0, []);
      return res;
    };

    if (includeZero) {
      cases.push({ name: "baseline: totals and facets match (no filters)", params: {} });
      if (searchTerm) {
        cases.push({ name: "search facet matches legacy when search filter applied (skip search)", params: { search: searchTerm } });
      }
    }

    const maxK = Math.min(Math.max(1, maxCombinationSize), entries.length);
    for (let k = 1; k <= maxK; k++) {
      for (const combo of kCombinations(entries, k)) {
        // params from the combo
        const params: any = {};
        for (const [key, value] of combo) {
          params[key] = value;
        }
        // special seeded-like behavior: when k=1 and key is needs, also include theme
        if (k === 1 && combo[0][0] === "needs" && needsSinglesIncludeThemeId) {
          params.themes = [needsSinglesIncludeThemeId];
        }

        // Title follows the pattern from the original suites: base on the first key
        const [firstKey] = combo[0];
        const otherKeys = combo.slice(1).map(([k]) => k);
        const baseName = singleTitles[firstKey] || firstKey;
        const suffix = otherKeys.length ? ` + ${otherKeys.join(" + ")}` : "";
        const name = `${baseName}${suffix}`;

        cases.push({ name, params });

        if (searchTerm) {
          cases.push({ name: `${name}`, params: { search: searchTerm, ...params } });
        }
      }
    }

    return cases;
  };

  // Seeded dataset cases
  const seededFilters: FiltersDef = {
    departments: ["75"],
    frenchLevel: ["a"],
    language: ["fr"],
    public: ["family"],
    status: ["refugie"],
    themes: [ids.themeB.toString()],
    needs: [ids.needB1.toString()],
  };

  runFacetTests(
    generateCases({
      filters: seededFilters,
      includeZero: true,
      maxCombinationSize: 1,
      searchTerm: "jeunes",
      // special rule: needs singles also include themeB
      needsSinglesIncludeThemeId: ids.themeB.toString(),
    }).map((c) => makeCase(c.name, c.params)),
  );

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

    // Randomized dataset cases
    const randomFilters: FiltersDef = {
      departments: ["75"],
      frenchLevel: ["a"],
      language: ["fr"],
      public: ["family"],
      status: ["refugie"],
      themes: ["6319f6b363ab2bbb162d7df5"],
      needs: ["6319f6b363ab2bbb162d7df6"],
    };

    runFacetTests(
      generateCases({
        filters: randomFilters,
        includeZero: true,
        maxCombinationSize: 3,
        searchTerm: "jeunes",
      }).map((c) => makeCase(c.name, c.params)),
    );
  });
});
