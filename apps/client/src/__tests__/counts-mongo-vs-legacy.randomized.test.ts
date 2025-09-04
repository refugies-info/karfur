import { seedRandomDispositifs } from "~/__fixtures__/arbitraries/dispositif.arb";
import { LegacyNeedsItem } from "~/__fixtures__/legacyCounts";
import {
  generateCases,
  getLegacyNeedsList,
  getSeedFilterIds,
  makeCase,
  resetDatabase,
  runFacetTests,
  setupMongoTest,
  teardownMongoTest,
  type FiltersDef,
  type TestSetup,
} from "~/__fixtures__/search-test-helpers";

/**
 * Randomized dataset tests: seeds many generated documents for broader coverage
 */
describe("Mongo counts vs legacy filterDispositifs (randomized)", () => {
  let setup: TestSetup;

  const { ids, themes, needs } = getSeedFilterIds();
  const needsList: LegacyNeedsItem[] = getLegacyNeedsList(ids) as any;

  beforeAll(async () => {
    setup = await setupMongoTest();
  });

  afterAll(async () => {
    await teardownMongoTest(setup);
  });

  beforeEach(async () => {
    await resetDatabase(setup.conn);
    // Seed many random documents for broader coverage. Seed ensures determinism across runs.
    await seedRandomDispositifs(setup.conn, ids, 100, 12345);
  });

  // Use shared helpers to generate cases

  // Randomized dataset cases (kept identical to original values)
  const randomFilters: FiltersDef = {
    departments: ["75"],
    frenchLevel: ["a"],
    language: ["fr"],
    public: ["family"],
    status: ["refugie"],
    themes: [themes.B],
    needs: [needs.B1],
  };

  runFacetTests(
    () => setup.conn,
    needsList,
    generateCases({
      filters: randomFilters,
      includeZero: true,
      maxCombinationSize: 3,
      searchTerm: "jeunes",
    }).map((c) => makeCase(c.name, c.params)),
  );
});
