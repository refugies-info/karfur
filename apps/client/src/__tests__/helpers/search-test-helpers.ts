import type { Connection } from "mongoose";
import { LegacyQuery, legacyFacetCounts } from "~/__fixtures__/legacyCounts";
import { QueryParams } from "~/lib/search-helpers";
import { computeSearchCounts } from "~/pages/api/search/counts";
import { makeNeedsList, makeSeedIds, type SeedIds } from "~/__fixtures__/seedIds";

// Mock Algolia client to reflect @algolia/client-search usage and avoid real network
jest.mock("@algolia/client-search", () => {
  const mockSearchSingleIndex = jest.fn().mockResolvedValue({ hits: [] });
  const searchClient = jest.fn(() => ({ searchSingleIndex: mockSearchSingleIndex }));
  // expose the mock so tests can reconfigure behavior per-connection
  return { searchClient, __mockSearchSingleIndex: mockSearchSingleIndex };
});

// Wire the Algolia mock to query the Mongo connection for simple text fields
export const configureAlgoliaMockFor = (conn: Connection) => {
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
};

export const toLegacyQuery = (p: Partial<LegacyQuery>): LegacyQuery => ({
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

export const toParams = (p: Partial<QueryParams>): QueryParams => ({
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

// Centralized helpers to access seed IDs in tests
export interface SeedFilterIds {
  ids: SeedIds;
  themes: { A: string; B: string; C: string };
  needs: { A1: string; A2: string; B1: string };
}

/**
 * Returns deterministic seed IDs along with convenient string maps for filters.
 * Use this in tests instead of hard-coding ObjectId strings.
 */
export const getSeedFilterIds = (): SeedFilterIds => {
  const ids = makeSeedIds();
  return {
    ids,
    themes: { A: ids.themeA.toString(), B: ids.themeB.toString(), C: ids.themeC.toString() },
    needs: { A1: ids.needA1.toString(), A2: ids.needA2.toString(), B1: ids.needB1.toString() },
  };
};

/**
 * Builds the legacy needsList structure from provided seed IDs (or fresh ones).
 */
export const getLegacyNeedsList = (ids?: SeedIds) => makeNeedsList(ids ?? makeSeedIds());

export const expectCountsEqual = (api: any, legacy: any) => {
  try {
    expect(api.total).toBe(legacy.total);
    expect(api.languages || {}).toEqual(legacy.languages);
    expect(api.publics || {}).toEqual(legacy.publics);
    expect(api.statuses || {}).toEqual(legacy.statuses);
    expect(api.frenchLevels || {}).toEqual(legacy.frenchLevels);
    expect(api.ageRanges || {}).toEqual(legacy.ageRanges);
    expect(api.themes || {}).toEqual(legacy.themes);
    expect(api.needs || {}).toEqual(legacy.needs);
  } catch (error) {
    // This will pause execution when debugging
    // eslint-disable-next-line no-debugger
    debugger;
    throw error; // Re-throw to maintain test failure behavior
  }
};

export const getAllDispositifs = async (conn: Connection) => {
  const Dispositif = conn.model("Dispositif");
  return (await Dispositif.find({ status: "Actif" }).lean()).map((d: any) => ({
    ...d,
    _id: d._id.toString(),
    theme: d.theme ? d.theme.toString() : null,
    secondaryThemes: Array.isArray(d.secondaryThemes) ? d.secondaryThemes.map((x: any) => x.toString()) : [],
    needs: Array.isArray(d.needs) ? d.needs.map((x: any) => x.toString()) : [],
    availableLanguages: (() => {
      const tr = d?.translations;
      if (!tr) return [] as string[];
      if (tr instanceof Map) return Array.from(tr.keys()).map(String);
      return Object.keys(tr).map(String);
    })(),
  }));
};

// Helper to register a suite of facet comparison tests from a list of cases
export const runFacetTests = (
  connOrGetter: Connection | (() => Connection),
  needsList: any,
  cases: Array<{
    name: string;
    params: Partial<QueryParams>;
    legacy: Partial<LegacyQuery>;
  }>,
) => {
  for (const c of cases) {
    test(c.name, async () => {
      const params = toParams(c.params);
      const conn = typeof connOrGetter === "function" ? (connOrGetter as () => Connection)() : connOrGetter;
      const api = await computeSearchCounts(conn, params);

      const all = await getAllDispositifs(conn);
      const legacy = legacyFacetCounts(all as any, needsList, toLegacyQuery(c.legacy));

      expectCountsEqual(api, legacy);
    });
  }
};

// Helper to avoid duplicating params as legacy for each case
export const makeCase = (name: string, params: Partial<QueryParams>) => ({
  name,
  params,
  legacy: params as Partial<LegacyQuery>,
});

// Title helpers
export const singleTitles: Record<string, string> = {
  departments: "departments facet matches legacy when department filter applied (skip location)",
  frenchLevel: "frenchLevel facet matches legacy when frenchLevel filter applied (skip frenchLevel)",
  language: "language facet matches legacy when language filter applied (skip language)",
  public: "public facet matches legacy when public filter applied (skip public)",
  status: "status facet matches legacy when status filter applied (skip status)",
  themes: "themes facet matches legacy when theme filter applied (skip theme)",
  needs: "needs facet matches legacy when needs filter applied (skip needs)",
} as const;

export type FiltersDef = Record<string, any[]>;

// Generate test params from filters
export const generateCases = (options: {
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
  const kCombinations = <T>(arr: T[], k: number): T[][] => {
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
      cases.push({
        name: "search facet matches legacy when search filter applied (skip search)",
        params: { search: searchTerm },
      });
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
      const otherKeys = combo.slice(1).map(([kk]) => kk);
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

// Centralized MongoDB test setup helper
export interface TestSetup {
  mongod: any;
  conn: Connection;
  models: any;
  closeDatabase: () => Promise<void>;
}

import { registerTestSchemas } from "./test-schemas";

/**
 * Sets up a MongoDB memory server and connection for testing
 * Registers all required test schemas (Theme, Need, Dispositif)
 * @returns Promise resolving to test setup object
 */
export const setupMongoTest = async (): Promise<TestSetup> => {
  const { MongoMemoryServer } = require("mongodb-memory-server");
  const mongoose = require("mongoose");

  const mongod = await MongoMemoryServer.create();
  const conn = await mongoose.createConnection(mongod.getUri(), { dbName: "test" }).asPromise();

  // Register all test schemas on this connection
  const models = registerTestSchemas(conn);

  // Configure Algolia mock for the connection
  configureAlgoliaMockFor(conn);

  return {
    conn,
    mongod,
    models,
    closeDatabase: async () => {
      await conn.close();
      await mongod.stop();
    },
  };
};

/**
 * Cleans up MongoDB test resources
 * @param setup The test setup object to clean up
 */
export const teardownMongoTest = async (setup: TestSetup): Promise<void> => {
  if (setup.conn) {
    await setup.conn.close();
  }
  if (setup.mongod) {
    await setup.mongod.stop();
  }
};

/**
 * Resets the database between tests
 * @param conn The MongoDB connection
 */
export const resetDatabase = async (conn: Connection): Promise<void> => {
  const db = conn.db;
  if (!db) throw new Error("Connection DB not initialized");
  await db.dropDatabase();
};

// Prevent Jest from failing this helpers file when collected as a test suite
describe.skip("counts-mongo helpers placeholder", () => {
  it("placeholder", () => {
    expect(true).toBe(true);
  });
});
