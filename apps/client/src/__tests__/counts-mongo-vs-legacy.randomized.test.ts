import { seedRandomDispositifs } from "~/__fixtures__/arbitraries/dispositif.arb";
import { LegacyNeedsItem } from "~/__fixtures__/legacyCounts";
import { DispositifSchema, makeNeedsList, makeSeedIds } from "~/__fixtures__/seedDispositifs";
import {
  generateCases,
  makeCase,
  resetDatabase,
  runFacetTests,
  setupMongoTest,
  teardownMongoTest,
  type FiltersDef,
  type TestSetup,
} from "./helpers/search-test-helpers";

/**
 * Randomized dataset tests: seeds many generated documents for broader coverage
 */
describe("Mongo counts vs legacy filterDispositifs (randomized)", () => {
  let setup: TestSetup;

  const ids = makeSeedIds();
  const needsList: LegacyNeedsItem[] = makeNeedsList(ids) as any;

  beforeAll(async () => {
    setup = await setupMongoTest(DispositifSchema);
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
    themes: ["6319f6b363ab2bbb162d7df5"],
    needs: ["6319f6b363ab2bbb162d7df6"],
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
