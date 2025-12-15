import type { Id, SimpleDispositif } from "@refugies-info/api-types";
import _ from "lodash";
import { filterDispositifs } from "~/lib/recherche/queryContents";

export type CountMap = Record<string, number>;

export interface LegacyNeedsItem {
  _id: Id;
  theme: { _id: Id };
}

export interface LegacyQuery {
  search: string;
  themes: string[];
  needs: string[];
  departments: string[];
  age: string[]; // e.g. ["0-5","65+"]
  frenchLevel: string[];
  public: string[];
  status: string[];
  language: string[];
}

// Returns dispositifs after applying ALL filters (no skip)
export function legacyFilterAll(
  dispositifs: SimpleDispositif[],
  allNeeds: LegacyNeedsItem[],
  query: LegacyQuery,
) {
  return filterDispositifs(query as any, dispositifs as any, false, undefined, allNeeds as any);
}

// Build need->theme map once
function buildNeedsThemeMap(allNeeds: LegacyNeedsItem[]) {
  // normalize to string keys/values to avoid ObjectId vs string mismatches in tests
  return allNeeds.reduce<Map<string, string>>(
    (map, need) => map.set(String(need._id), String(need.theme._id)),
    new Map(),
  );
}

// Compute age ranges for a dispositif like server does (updated bins: -18, 18-25, +25)
function computeAgeRanges(d: any): string[] {
  const age = d?.metadatas?.age as { type?: string; ages?: number[] } | undefined;
  if (!age || !age.type || !Array.isArray(age.ages) || age.ages.length === 0) return [];

  // Normalize to a numeric [min, max] interval (max can be Infinity)
  let min = 0;
  let max = Infinity as number;
  if (age.type === "between") {
    const a = Number(age.ages?.[0]);
    const b = Number(age.ages?.[1] ?? age.ages?.[0]);
    if (Number.isFinite(a)) min = a;
    if (Number.isFinite(b)) max = b;
  } else if (age.type === "moreThan") {
    const a = Number(age.ages?.[0]);
    if (Number.isFinite(a)) min = a;
    max = Infinity;
  } else if (age.type === "lessThan") {
    min = 0;
    const b = Number(age.ages?.[0]);
    if (Number.isFinite(b)) max = b;
  } else {
    return [];
  }

  const result: string[] = [];
  // bin is fully covered by [aMin,aMax]
  const covers = (aMin: number, aMax: number, bMin: number, bMax: number) =>
    aMin <= bMin && aMax >= bMax;

  // Bins
  const BIN1: [number, number] = [0, 17]; // -18
  const BIN2: [number, number] = [18, 25]; // 18-25
  const BIN3: [number, number] = [25, Infinity]; // +25 (inclusive of 25)

  if (covers(min, max, BIN1[0], BIN1[1])) result.push("-18");
  if (covers(min, max, BIN2[0], BIN2[1])) result.push("18-25");
  if (covers(min, max, BIN3[0], BIN3[1])) result.push("+25");

  return result;
}

export interface LegacyFacetCounts {
  total: number;
  themes: CountMap;
  needs: CountMap;
  languages: CountMap;
  publics: CountMap;
  statuses: CountMap;
  frenchLevels: CountMap;
  ageRanges: CountMap;
}

// Compute facet counts by skipping the facet under computation
export function legacyFacetCounts(
  dispositifs: SimpleDispositif[],
  allNeeds: LegacyNeedsItem[],
  query: LegacyQuery,
): LegacyFacetCounts {
  // Apply search filtering first to simulate Algolia pre-filtering in the new API
  const q = (query.search || "").trim();
  const filteredBySearch = q
    ? (dispositifs as any[]).filter((d) => {
        const needle = q.toLowerCase();
        const hay = [
          (d as any).title,
          (d as any).name,
          (d as any).titreMarque,
          (d as any).abstract,
          (d as any).sponsorName,
        ]
          .filter(Boolean)
          .map((x) => String(x).toLowerCase());
        return hay.some((s) => s.includes(needle));
      })
    : (dispositifs as any[]);

  const needsMap = buildNeedsThemeMap(allNeeds);

  // Helper to count fields
  const countBy = (arr: any[], iteratee: (d: any) => string | string[] | undefined) => {
    return arr
      .flatMap((d) => {
        const v = iteratee(d);
        if (v === undefined) return [] as string[];
        return Array.isArray(v) ? v : [v];
      })
      .reduce<CountMap>((acc, k) => {
        if (!k) return acc;
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      }, {});
  };

  // Total (no skip)
  const allFiltered = filterDispositifs(
    query as any,
    filteredBySearch as any,
    false,
    undefined,
    allNeeds as any,
  );

  // Themes facet (skip theme)
  const forThemes = filterDispositifs(
    query as any,
    filteredBySearch as any,
    false,
    "theme",
    allNeeds as any,
  );
  const themes = countBy(forThemes, (d: any) => {
    const ids: string[] = [];
    if (d?.theme) ids.push(String(d.theme));
    if (Array.isArray(d?.secondaryThemes))
      ids.push(...d.secondaryThemes.map((t: any) => String(t)));
    return ids.length > 0 ? ids : undefined;
  });

  // Needs facet: mimic ThemeMenu behavior, but support secondaryThemes.
  // Skip theme facet; count needs whose parent theme matches the dispositif's primary or any secondary theme.
  const needs = _(forThemes)
    .filter((d: any) => Array.isArray(d.needs) && d.needs.length > 0)
    .flatMap((d: any) => {
      const themeIds = new Set<string>();
      if (d?.theme) themeIds.add(String(d.theme));
      if (Array.isArray(d?.secondaryThemes))
        d.secondaryThemes.forEach((t: any) => themeIds.add(String(t)));
      return (d.needs as Id[]).filter((id: Id) => {
        const needId = String(id);
        const themeId = String(needsMap.get(needId));
        return themeIds.has(themeId);
      });
    })
    .countBy((id) => String(id))
    .value();

  // Languages facet (skip language)
  const forLanguages = filterDispositifs(
    query as any,
    filteredBySearch as any,
    false,
    "language",
    allNeeds as any,
  );
  const languages = countBy(forLanguages, (d: any) => {
    // In test context, objects conform to SimpleDispositif and expose availableLanguages
    return (d?.availableLanguages || []).map(String);
  });

  // Publics facet (skip public)
  const forPublics = filterDispositifs(
    query as any,
    filteredBySearch as any,
    false,
    "public",
    allNeeds as any,
  );
  const publics = countBy(forPublics, (d: any) => (d?.metadatas?.public || []).map(String));

  // Statuses facet (skip status) — counts refugee statuses stored in metadatas.publicStatus
  // For statuses facet, skip the refugee status filter
  const forStatuses = filterDispositifs(
    query as any,
    filteredBySearch as any,
    false,
    "status",
    allNeeds as any,
  );
  const statuses = countBy(forStatuses, (d: any) => (d?.metadatas?.publicStatus || []).map(String));

  // French levels facet (skip frenchLevel). Group by categories a/b/c; empty -> ["a","b","c"].
  const forFrench = filterDispositifs(
    query as any,
    filteredBySearch as any,
    false,
    "frenchLevel",
    allNeeds as any,
  );
  const mapFrenchCats = (d: any): string[] => {
    const levels: string[] = (d?.metadatas?.frenchLevel || []).map(String);
    if (!levels || levels.length === 0) return ["a", "b", "c"];
    const cats = new Set<string>();
    for (const lvl of levels) {
      if (["alpha", "A1", "A2"].includes(lvl)) cats.add("a");
      else if (["B1", "B2"].includes(lvl)) cats.add("b");
      else if (["C1", "C2"].includes(lvl)) cats.add("c");
    }
    return Array.from(cats);
  };
  const frenchLevels = countBy(forFrench, (d: any) => mapFrenchCats(d));

  // Age ranges facet (skip age)
  const forAges = filterDispositifs(
    query as any,
    filteredBySearch as any,
    false,
    "age",
    allNeeds as any,
  );
  const ageRanges = countBy(forAges, (d: any) => computeAgeRanges(d));

  return {
    total: allFiltered.length,
    themes,
    needs,
    languages,
    publics,
    statuses,
    frenchLevels,
    ageRanges,
  };
}
