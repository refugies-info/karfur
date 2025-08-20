import { legacyFacetCounts, LegacyNeedsItem } from "~/__fixtures__/legacyCounts";
import { makeSeedIds, makeNeedsList, seedDispositifs } from "~/__fixtures__/seedDispositifs";
import { TestSchemas } from "~/__tests__/helpers/test-schemas";
import {
  generateCases,
  getAllDispositifs,
  makeCase,
  resetDatabase,
  runFacetTests,
  setupMongoTest,
  teardownMongoTest,
  toLegacyQuery,
  type FiltersDef,
  type TestSetup,
} from "./helpers/search-test-helpers";

/**
 * Seeded dataset tests: uses deterministic fixtures from `seedDispositifs()`
 */
describe("Mongo counts vs legacy filterDispositifs (seeded)", () => {
  let setup: TestSetup;

  const ids = makeSeedIds();
  const needsList: LegacyNeedsItem[] = makeNeedsList(ids) as any;

  beforeAll(async () => {
    setup = await setupMongoTest();
  });

  afterAll(async () => {
    await teardownMongoTest(setup);
  });

  beforeEach(async () => {
    await resetDatabase(setup.conn);
    await seedDispositifs(setup.conn, ids);
  });

  test("Legacy counts should match manual counts", async () => {
    const all = await getAllDispositifs(setup.conn);
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
    const all = await getAllDispositifs(setup.conn);
    const needsList: LegacyNeedsItem[] = makeNeedsList(ids) as any;
    const legacy = legacyFacetCounts(all as any, needsList, toLegacyQuery({ frenchLevel: ["a"] }));
    expect(13).toBe(legacy.total);
    expect({ en: 1, fr: 13 }).toEqual(legacy.languages);
    expect({ youths: 4, senior: 4, family: 5 }).toEqual(legacy.publics);
    expect({ asile: 12, apatride: 1, refugie: 2, temporaire: 1, subsidiaire: 1 }).toEqual(legacy.statuses);
    expect({ a: 13, b: 11, c: 1 }).toEqual(legacy.frenchLevels);
    expect({ "+25": 2, "-18": 1, "18-25": 11 }).toEqual(legacy.ageRanges);
    expect({ "64a0000000000000000000a1": 8, "64a0000000000000000000b2": 5, "64a0000000000000000000c3": 3 }).toEqual(
      legacy.themes,
    );
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
    () => setup.conn,
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
