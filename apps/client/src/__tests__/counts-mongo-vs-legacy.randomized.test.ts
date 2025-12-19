import { seedRandomDispositifs } from "~/__fixtures__/arbitraries/dispositif.arb";
import {
  type FiltersDef,
  generateCases,
  getLegacyNeedsList,
  getSeedNeedIdsAsStrings,
  getSeedThemeIdsAsStrings,
  makeCase,
  resetDatabase,
  runFacetTests,
  setupMongoTest,
  type TestSetup,
  teardownMongoTest,
} from "~/__fixtures__/search/helpers";
import type { LegacyNeedsItem } from "~/__fixtures__/search/legacy-counts";

/**
 * Randomized dataset tests: seeds many generated documents for broader coverage
 */
describe.skip("Mongo counts vs legacy filterDispositifs (randomized)", () => {
  let setup: TestSetup;

  const { TB } = getSeedThemeIdsAsStrings();
  const { NB1 } = getSeedNeedIdsAsStrings();
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
    await seedRandomDispositifs(setup.conn, 100, 12345);
  });

  // Use shared helpers to generate cases

  // Randomized dataset cases (kept identical to original values)
  const randomFilters: FiltersDef = {
    departments: ["75"],
    frenchLevel: ["a"],
    language: ["fr"],
    public: ["family"],
    status: ["refugie"],
    themes: [TB],
    needs: [NB1],
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
