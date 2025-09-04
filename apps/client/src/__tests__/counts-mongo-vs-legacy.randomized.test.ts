import { seedRandomDispositifs } from "~/__fixtures__/arbitraries/dispositif.arb";
import {
  generateCases,
  getLegacyNeedsList,
  getSeedNeedIds,
  getSeedThemeIds,
  makeCase,
  resetDatabase,
  runFacetTests,
  setupMongoTest,
  teardownMongoTest,
  type FiltersDef,
  type TestSetup,
} from "~/__fixtures__/search/helpers";
import { LegacyNeedsItem } from "~/__fixtures__/search/legacy-counts";

/**
 * Randomized dataset tests: seeds many generated documents for broader coverage
 */
describe("Mongo counts vs legacy filterDispositifs (randomized)", () => {
  let setup: TestSetup;

  const { B: themeB, themeIds } = getSeedThemeIds();
  const { B1: needB1, needIds } = getSeedNeedIds();
  const needsList: LegacyNeedsItem[] = getLegacyNeedsList() as any;

  beforeAll(async () => {
    setup = await setupMongoTest();
  });

  afterAll(async () => {
    await teardownMongoTest(setup);
  });

  beforeEach(async () => {
    await resetDatabase(setup.conn);
    // Seed many random documents for broader coverage. Seed ensures determinism across runs.
    await seedRandomDispositifs(setup.conn, themeIds, needIds, 100, 12345);
  });

  // Use shared helpers to generate cases

  // Randomized dataset cases (kept identical to original values)
  const randomFilters: FiltersDef = {
    departments: ["75"],
    frenchLevel: ["a"],
    language: ["fr"],
    public: ["family"],
    status: ["refugie"],
    themes: [themeB],
    needs: [needB1],
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
