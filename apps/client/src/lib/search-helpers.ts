import { searchClient, type SearchClient } from "@algolia/client-search";
import { AgeOptions, FrenchOptions, PublicOptions, StatusOptions } from "data/searchFilters";
import mongoose from "mongoose";
import { ParsedUrlQuery } from "querystring";

interface SearchQuery extends ParsedUrlQuery {
  search?: string;
  departments?: string | string[];
  themes?: string | string[];
  needs?: string | string[];
  age?: string | string[];
  frenchLevel?: string | string[];
  public?: string | string[];
  status?: string | string[];
  language?: string | string[];
  sort?: string;
}

export const getQueryParamAsArray = (param: string | string[] | undefined): string[] => {
  if (!param) return [];
  return Array.isArray(param) ? param : [param];
};

export interface QueryParams {
  search?: string;
  departments?: string[];
  themes?: string[];
  needs?: string[];
  age?: AgeOptions[];
  frenchLevel?: FrenchOptions[];
  public?: PublicOptions[];
  status?: StatusOptions[];
  language?: string[];
  sort?: string;
}

export const buildQueryParams = (query: SearchQuery): QueryParams => ({
  search: typeof query.search === "string" ? query.search : undefined,
  departments: getQueryParamAsArray(query.departments),
  themes: getQueryParamAsArray(query.themes),
  needs: getQueryParamAsArray(query.needs),
  age: getQueryParamAsArray(query.age).filter((a): a is AgeOptions => a === "-18" || a === "18-25" || a === "+25"),
  frenchLevel: getQueryParamAsArray(query.frenchLevel).filter(
    (x): x is FrenchOptions => x === "a" || x === "b" || x === "c",
  ),
  public: getQueryParamAsArray(query.public).filter(
    (v): v is PublicOptions => typeof v === "string" && v.trim().length > 0,
  ),
  status: getQueryParamAsArray(query.status).filter(
    (v): v is StatusOptions => typeof v === "string" && v.trim().length > 0,
  ),
  language: getQueryParamAsArray(query.language),
  sort: typeof query.sort === "string" ? query.sort : undefined,
});

export const buildBaseMatch = (queryParams: Omit<QueryParams, "sort">, algoliaIds?: string[]): any => {
  const match: any = { status: "Actif" };

  if (algoliaIds) {
    match._id = { $in: algoliaIds.map((id: string) => new mongoose.Types.ObjectId(id)) };
  }

  const departments = (queryParams.departments ?? []).filter((v) => typeof v === "string" && v.trim().length > 0);
  if (departments.length > 0) {
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tokensOrRegexes = departments.map((dep) => {
      if (dep === "france" || dep === "online" || dep.includes(" - ")) return dep;
      return new RegExp(` \\- ${escapeRegExp(dep)}$`, "i");
    });
    match["metadatas.location"] = { $in: tokensOrRegexes };
  }

  const themes = (queryParams.themes ?? []).filter((v) => typeof v === "string" && v.trim().length > 0);
  const needs = (queryParams.needs ?? []).filter((v) => typeof v === "string" && v.trim().length > 0);
  if (themes.length > 0 && needs.length > 0) {
    // Legacy filterByThemeOrNeed() semantics: when both themes and needs are provided,
    // a record matches if it has the theme OR the need (not both).
    const themeIds = themes.map((t: string) => new mongoose.Types.ObjectId(t));
    const needIds = needs.map((n: string) => new mongoose.Types.ObjectId(n));
    match.$or = (match.$or || []).concat([{ theme: { $in: themeIds } }, { needs: { $in: needIds } }]);
  } else {
    if (themes.length > 0) {
      const themeIds = themes.map((t: string) => new mongoose.Types.ObjectId(t));
      match.$or = (match.$or || []).concat([{ theme: { $in: themeIds } }]);
    }

    if (needs.length > 0) {
      const needIds = needs.map((n: string) => new mongoose.Types.ObjectId(n));
      // Legacy behavior note: parent theme alignment is handled at aggregation time where needed
      match.needs = { $in: needIds };
    }
  }

  const ages = (queryParams.age ?? []).filter((a): a is AgeOptions => a === "-18" || a === "18-25" || a === "+25");
  if (ages.length > 0) {
    const minAgeExpr = {
      $switch: {
        branches: [
          {
            case: { $eq: ["$metadatas.age.type", "between"] },
            then: { $toInt: { $ifNull: [{ $arrayElemAt: ["$metadatas.age.ages", 0] }, 0] } },
          },
          {
            case: { $eq: ["$metadatas.age.type", "moreThan"] },
            then: {
              $add: [{ $toInt: { $ifNull: [{ $arrayElemAt: ["$metadatas.age.ages", 0] }, 0] } }, 1],
            },
          },
          { case: { $eq: ["$metadatas.age.type", "lessThan"] }, then: 0 },
        ],
        default: 0,
      },
    };
    const maxAgeExpr = {
      $switch: {
        branches: [
          {
            case: { $eq: ["$metadatas.age.type", "between"] },
            then: { $toInt: { $ifNull: [{ $arrayElemAt: ["$metadatas.age.ages", 1] }, 999] } },
          },
          {
            case: { $eq: ["$metadatas.age.type", "moreThan"] },
            then: 999,
          },
          {
            case: { $eq: ["$metadatas.age.type", "lessThan"] },
            then: { $toInt: { $ifNull: [{ $arrayElemAt: ["$metadatas.age.ages", 0] }, 999] } },
          },
        ],
        default: 999,
      },
    };
    const ageConditions = ages
      .map((age) => {
        if (age === "-18") {
          return { $lt: [maxAgeExpr, 18] };
        } else if (age === "18-25") {
          return { $and: [{ $gte: [minAgeExpr, 18] }, { $lte: [maxAgeExpr, 25] }] };
        } else if (age === "+25") {
          return { $gt: [minAgeExpr, 25] };
        }
        return null;
      })
      .filter((cond) => cond !== null);
    if (ageConditions.length > 0) {
      match.$expr = { $or: ageConditions };
    }
  }

  const frenchLevel = (queryParams.frenchLevel ?? []).filter(
    (x): x is FrenchOptions => x === "a" || x === "b" || x === "c",
  );
  if (frenchLevel.length > 0) {
    const allowedLevels = Array.from(
      new Set(
        frenchLevel.flatMap((cat) => (cat === "a" ? ["alpha", "A1", "A2"] : cat === "b" ? ["B1", "B2"] : ["C1", "C2"])),
      ),
    );
    // Match if the field (string or array) contains any allowedLevels
    match["metadatas.frenchLevel"] = { $in: allowedLevels };
  }

  const publics = (queryParams.public ?? []).filter((v) => typeof v === "string" && v.trim().length > 0);
  if (publics.length > 0) {
    match["metadatas.public"] = { $in: publics };
  }

  const statuses = (queryParams.status ?? []).filter((v) => typeof v === "string" && v.trim().length > 0);
  if (statuses.length > 0) {
    match["metadatas.publicStatus"] = { $in: statuses };
  }

  const languages = (queryParams.language ?? []).filter((v) => typeof v === "string" && v.trim().length > 0);
  if (languages.length > 0) {
    const languageConditions = languages.map((lang) => ({
      // translations is an object whose keys are language codes (e.g., fr, en)
      // We must check the existence of the nested key rather than a top-level field
      [`translations.${lang}`]: { $exists: true },
    }));
    // Ensure language conditions are ANDed with other filters while ORed among themselves
    match.$and = (match.$and || []).concat([{ $or: languageConditions }]);
  }

  return match;
};

export const getSearchClient = (): {
  algoliaClient: SearchClient;
  indexName: string;
} => {
  const algoliaClient = searchClient("L9HYT1676M", process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_API_KEY || "");
  const indexName =
    (process.env.NEXT_PUBLIC_REACT_APP_ENV === "production"
      ? process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_PROD
      : process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_STG) || "";

  return { algoliaClient, indexName };
};
