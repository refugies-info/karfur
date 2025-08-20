import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection } from "mongoose";
import { seedRandomDispositifs } from "~/__fixtures__/arbitraries/dispositif.arb";
import { LegacyNeedsItem } from "~/__fixtures__/legacyCounts";
import { DispositifSchema, makeNeedsList, makeSeedIds } from "~/__fixtures__/seedDispositifs";
import {
  configureAlgoliaMockFor,
  generateCases,
  makeCase,
  runFacetTests,
  type FiltersDef,
} from "./helpers/search-test-helpers";

/**
 * Randomized dataset tests: seeds many generated documents for broader coverage
 */
describe("Mongo counts vs legacy filterDispositifs (randomized)", () => {
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
    // Seed many random documents for broader coverage. Seed ensures determinism across runs.
    await seedRandomDispositifs(conn, ids, 100, 12345);
  });

  // Use shared helpers to generate cases

  // Randomized dataset cases (kept identical to original values)
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
    () => conn,
    needsList,
    generateCases({
      filters: randomFilters,
      includeZero: true,
      maxCombinationSize: 3,
      searchTerm: "jeunes",
    }).map((c) => makeCase(c.name, c.params)),
  );
});
