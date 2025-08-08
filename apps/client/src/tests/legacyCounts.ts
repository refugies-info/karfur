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

// Compute age ranges for a dispositif like server does
function computeAgeRanges(d: any): string[] {
  const from = d?.metadatas?.age?.from ?? 0;
  const to = d?.metadatas?.age?.to ?? 200;
  const ranges: string[] = [];
  const push = (a: number, b: number) => ranges.push(`${a}-${b}`);
  if (to >= 0 && from <= 5) push(0, 5);
  if (to >= 6 && from <= 10) push(6, 10);
  if (to >= 11 && from <= 13) push(11, 13);
  if (to >= 14 && from <= 15) push(14, 15);
  if (to >= 16 && from <= 17) push(16, 17);
  if (to >= 18 && from <= 25) push(18, 25);
  if (to >= 26 && from <= 64) push(26, 64);
  if (to >= 65) ranges.push("65+");
  return ranges;
}

export interface LegacyFacetCounts {
  total: number;
  themes: CountMap;
  needs: CountMap;
  departments: CountMap;
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
  const allFiltered = filterDispositifs(query as any, dispositifs as any, false, undefined, allNeeds as any);

  // Themes facet (skip theme)
  const forThemes = filterDispositifs(query as any, dispositifs as any, false, "theme", allNeeds as any);
  const themes = countBy(
    forThemes.filter((d: any) => d.theme),
    (d: any) => (d.theme ? String(d.theme) : undefined),
  );

  // Needs facet: legacy doesn’t support skipping needs alone, we mimic ThemeMenu: skip theme, count needs that belong to the dispositif theme
  const needs = _(forThemes)
    .filter((d: any) => d.theme)
    .flatMap((d: any) => (d.needs || []).filter((id: Id) => needsMap.get(String(id)) === String(d.theme)))
    .countBy((id) => String(id))
    .value();

  // Departments facet (skip location)
  const forDepartments = filterDispositifs(query as any, dispositifs as any, false, "location", allNeeds as any);
  const departments = countBy(forDepartments, (d: any) => d?.metadatas?.location);

  // Languages facet (skip language)
  const forLanguages = filterDispositifs(query as any, dispositifs as any, false, "language", allNeeds as any);
  const languages = countBy(forLanguages, (d: any) => (d?.availableLanguages || []).map(String));

  // Publics facet (skip public)
  const forPublics = filterDispositifs(query as any, dispositifs as any, false, "public", allNeeds as any);
  const publics = countBy(forPublics, (d: any) => (d?.metadatas?.public || []).map(String));

  // Statuses facet (skip status)
  const forStatuses = filterDispositifs(query as any, dispositifs as any, false, "status", allNeeds as any);
  const statuses = countBy(forStatuses, (d: any) => d?.status);

  // French levels facet (skip frenchLevel)
  const forFrench = filterDispositifs(query as any, dispositifs as any, false, "frenchLevel", allNeeds as any);
  const frenchLevels = countBy(forFrench, (d: any) => (d?.metadatas?.frenchLevel || []).map(String));

  // Age ranges facet (skip age)
  const forAges = filterDispositifs(query as any, dispositifs as any, false, "age", allNeeds as any);
  const ageRanges = countBy(forAges, (d: any) => computeAgeRanges(d));

  return {
    total: allFiltered.length,
    themes,
    needs,
    departments,
    languages,
    publics,
    statuses,
    frenchLevels,
    ageRanges,
  };
}
