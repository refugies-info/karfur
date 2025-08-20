import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection } from "mongoose";
import { legacyFacetCounts, LegacyNeedsItem } from "~/__fixtures__/legacyCounts";
import { DispositifSchema, makeNeedsList, makeSeedIds, seedDispositifs } from "~/__fixtures__/seedDispositifs";
import {
  configureAlgoliaMockFor,
  generateCases,
  getAllDispositifs,
  makeCase,
  runFacetTests,
  toLegacyQuery,
  type FiltersDef,
} from "./helpers/counts-mongo-helpers";

/**
 * Seeded dataset tests: uses deterministic fixtures from `seedDispositifs()`
 */
describe("Mongo counts vs legacy filterDispositifs (seeded)", () => {
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
    configureAlgoliaMockFor(conn);
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

  test("Legacy counts should match manual counts", async () => {
    const all = await getAllDispositifs(conn);
    const needsList: LegacyNeedsItem[] = makeNeedsList(ids) as any;
    const legacy = legacyFacetCounts(all as any, needsList, toLegacyQuery({}));
    expect(24).toBe(legacy.total);
    expect({ en: 2, fr: 24 }).toEqual(legacy.languages);
    expect({ family: 10, youths: 7, senior: 8 }).toEqual(legacy.publics);
    expect({ asile: 20, apatride: 1, french: 2, refugie: 2, subsidiaire: 2, temporaire: 1 }).toEqual(legacy.statuses);
    expect({ a: 13, b: 11, c: 1 }).toEqual(legacy.frenchLevels);
    expect({ "+25": 2, "-18": 1, "18-25": 20 }).toEqual(legacy.ageRanges);
    expect({ "64a0000000000000000000a1": 13, "64a0000000000000000000b2": 10, "64a0000000000000000000c3": 6 }).toEqual(
      legacy.themes,
    );
    expect({ "64b0000000000000000000a1": 5, "64b0000000000000000000a2": 4, "64b0000000000000000000b1": 4 }).toEqual(
      legacy.needs,
    );
  });

  test("Legacy counts when skipping frenchLevel should match manual counts", async () => {
    const all = await getAllDispositifs(conn);
    const needsList: LegacyNeedsItem[] = makeNeedsList(ids) as any;
    const legacy = legacyFacetCounts(all as any, needsList, toLegacyQuery({ frenchLevel: ["a"] }));
    expect(13).toBe(legacy.total);
    expect({ en: 1, fr: 13 }).toEqual(legacy.languages);
    expect({ youths: 4, senior: 4, family: 5 }).toEqual(legacy.publics);
    expect({ asile: 12, apatride: 1, refugie: 2, temporaire: 1, subsidiaire: 1 }).toEqual(legacy.statuses);
    expect({ a: 13, b: 11, c: 1 }).toEqual(legacy.frenchLevels);
    expect({ "+25": 2, "-18": 1, "18-25": 11 }).toEqual(legacy.ageRanges);
    expect({ "64a0000000000000000000a1": 8, "64a0000000000000000000b2": 5, "64a0000000000000000000c3": 3 }).toEqual(legacy.themes);
    expect({ "64b0000000000000000000a1": 3, "64b0000000000000000000a2": 3, "64b0000000000000000000b1": 2 }).toEqual(
      legacy.needs,
    );
  });

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
    () => conn,
    needsList,
    generateCases({
      filters: seededFilters,
      includeZero: true,
      maxCombinationSize: 1,
      searchTerm: "jeunes",
      // special rule: needs singles also include themeB
      needsSinglesIncludeThemeId: ids.themeB.toString(),
    }).map((c) => makeCase(c.name, c.params)),
  );
});
