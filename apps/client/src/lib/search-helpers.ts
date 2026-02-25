import { type SearchClient, searchClient } from "@algolia/client-search";
import type { AgeOptions, FrenchOptions, PublicOptions, StatusOptions } from "data/searchFilters";
import mongoose from "mongoose";
import type { ParsedUrlQuery } from "querystring";

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
  age: getQueryParamAsArray(query.age).filter(
    (a): a is AgeOptions => a === "-18" || a === "18-25" || a === "+25",
  ),
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

export const buildBaseMatch = (
  queryParams: Omit<QueryParams, "sort">,
  algoliaIds?: string[],
): any => {
  const match: any = { status: "Actif" };

  if (algoliaIds) {
    match._id = { $in: algoliaIds.map((id: string) => new mongoose.Types.ObjectId(id)) };
  }

  const departments = (queryParams.departments ?? []).filter(
    (v) => typeof v === "string" && v.trim().length > 0,
  );
  if (departments.length > 0) {
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tokensOrRegexes = departments.map((dep) => {
      if (dep === "france" || dep === "online" || dep.includes(" - ")) return dep;
      return new RegExp(` \\- ${escapeRegExp(dep)}$`, "i");
    });
    // Fiches "toute la france" should always appear when filtering by department
    match["metadatas.location"] = { $in: [...tokensOrRegexes, "france"] };
  }

  const themes = (queryParams.themes ?? []).filter(
    (v) => typeof v === "string" && v.trim().length > 0,
  );
  const needs = (queryParams.needs ?? []).filter(
    (v) => typeof v === "string" && v.trim().length > 0,
  );
  if (themes.length > 0 && needs.length > 0) {
    // Legacy filterByThemeOrNeed() semantics: when both themes and needs are provided,
    // a record matches if it has the theme OR the need (not both).
    const themeIds = themes.map((t: string) => new mongoose.Types.ObjectId(t));
    const needIds = needs.map((n: string) => new mongoose.Types.ObjectId(n));
    match.$or = (match.$or || []).concat([
      { theme: { $in: themeIds } },
      { needs: { $in: needIds } },
    ]);
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

  const ages = (queryParams.age ?? []).filter(
    (a): a is AgeOptions => a === "-18" || a === "18-25" || a === "+25",
  );
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
        frenchLevel.flatMap((cat) =>
          cat === "a" ? ["alpha", "A1", "A2"] : cat === "b" ? ["B1", "B2"] : ["C1", "C2"],
        ),
      ),
    );
    // Match if the field (string or array) contains any allowedLevels
    match["metadatas.frenchLevel"] = { $in: allowedLevels };
  }

  const publics = (queryParams.public ?? []).filter(
    (v) => typeof v === "string" && v.trim().length > 0,
  );
  if (publics.length > 0) {
    match["metadatas.public"] = { $in: publics };
  }

  const statuses = (queryParams.status ?? []).filter(
    (v) => typeof v === "string" && v.trim().length > 0,
  );
  if (statuses.length > 0) {
    match["metadatas.publicStatus"] = { $in: statuses };
  }

  const languages = (queryParams.language ?? []).filter(
    (v) => typeof v === "string" && v.trim().length > 0,
  );
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
  const algoliaClient = searchClient(
    "L9HYT1676M",
    process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_API_KEY || "",
  );
  const indexName =
    (process.env.NEXT_PUBLIC_REACT_APP_ENV === "production"
      ? process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_PROD
      : process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_STG) || "";

  return { algoliaClient, indexName };
};

// --- Server-side search results computation ---

export interface SearchResultsOptions {
  page: number;
  limit: number;
  type?: string;
  sort?: string;
}

export interface SearchResponse {
  results: any[];
  suggestions: any[];
  total: number;
  programCount: number;
  procedureCount: number;
  onlineCount: number;
  page: number;
  pageCount: number;
}

const RESULTS_PROJECTION = {
  _id: 1,
  titreInformatif: 1,
  titreMarque: 1,
  abstract: 1,
  typeContenu: 1,
  status: 1,
  theme: 1,
  secondaryThemes: 1,
  needs: 1,
  metadatas: 1,
  created_at: 1,
  publishedAt: 1,
  lastModificationDate: 1,
  nbMots: 1,
  nbVues: 1,
  nbVuesMobile: 1,
  sponsor: 1,
  availableLanguages: 1,
  hasDraftVersion: 1,
  themeSortIndex: 1,
  origin: 1,
};

/**
 * Resolves Algolia text-search IDs if a search term is provided.
 * Returns undefined when no search term is given.
 */
export const resolveAlgoliaIds = async (
  search: string | undefined,
): Promise<string[] | undefined> => {
  if (!search) return undefined;
  const { algoliaClient, indexName } = getSearchClient();
  const searchResults = await algoliaClient.searchSingleIndex({
    indexName,
    searchParams: {
      query: search,
      attributesToRetrieve: ["objectID"],
      hitsPerPage: 1000,
    },
  });
  return searchResults.hits.map((hit: { objectID: string }) => hit.objectID);
};

/**
 * Build the MongoDB aggregation pipeline for search results.
 */
const buildSearchAggregation = (baseMatch: any, options: SearchResultsOptions): any[] => {
  const { page, limit, sort } = options;

  const aggregation: any[] = [
    { $match: baseMatch },
    {
      $lookup: {
        from: "themes",
        localField: "theme",
        foreignField: "_id",
        as: "themeDoc",
      },
    },
    { $unwind: { path: "$themeDoc", preserveNullAndEmptyArrays: true } },
    { $addFields: { themeSortIndex: { $ifNull: ["$themeDoc.position", 999] } } },
  ];

  if (sort === "theme") {
    aggregation.push({ $sort: { themeSortIndex: 1, "metadatas.updatedAt": -1 } });
  } else if (sort === "location") {
    aggregation.push({
      $addFields: {
        isLocal: {
          $cond: { if: { $in: ["$metadatas.location"] }, then: 1, else: 2 },
        },
      },
    });
    aggregation.push({ $sort: { isLocal: 1, "metadatas.vues": -1 } });
  } else if (sort === "views") {
    aggregation.push({ $sort: { "metadatas.vues": -1 } });
  } else {
    aggregation.push({ $sort: { "metadatas.updatedAt": -1 } });
  }

  aggregation.push({ $skip: (page - 1) * limit });
  aggregation.push({ $limit: limit });
  aggregation.push({ $project: RESULTS_PROJECTION });

  return aggregation;
};

/**
 * Build a suggestions query: items where selected themes appear as secondary themes,
 * excluding those already matched by the main query.
 */
const buildSuggestionsQuery = async (
  Dispositif: any,
  baseMatch: any,
  queryParams: QueryParams,
): Promise<any[]> => {
  const themes = (queryParams.themes ?? []).filter(
    (v) => typeof v === "string" && v.trim().length > 0,
  );
  const needs = (queryParams.needs ?? []).filter(
    (v) => typeof v === "string" && v.trim().length > 0,
  );

  if (themes.length === 0 && needs.length === 0) return [];

  if (themes.length > 0) {
    const themeIds = themes.map((t) => new mongoose.Types.ObjectId(t));
    // Items that have selected themes as secondary themes but NOT as primary theme
    const suggestionsMatch = {
      ...baseMatch,
      theme: { $nin: themeIds },
      secondaryThemes: { $in: themeIds },
    };
    // Remove theme-related conditions from $or since we want secondary-only
    delete suggestionsMatch.$or;
    return Dispositif.aggregate([
      { $match: { ...suggestionsMatch, status: "Actif" } },
      { $sort: { nbVues: -1 } },
      { $limit: 8 },
      { $project: RESULTS_PROJECTION },
    ]);
  }

  if (needs.length > 0) {
    const needIds = needs.map((n) => new mongoose.Types.ObjectId(n));
    // Find needs' parent themes, then get items from those themes without the selected needs
    const NeedModel =
      Dispositif.db.models.Need ||
      Dispositif.db.model("Need", new mongoose.Schema({}, { strict: false, collection: "needs" }));
    const selectedNeeds = await NeedModel.find({ _id: { $in: needIds } }, { theme: 1 }).lean();
    const parentThemeIds = [...new Set(selectedNeeds.map((n: any) => n.theme))];

    if (parentThemeIds.length === 0) return [];

    return Dispositif.aggregate([
      {
        $match: {
          status: "Actif",
          theme: { $in: parentThemeIds },
          needs: { $nin: needIds },
        },
      },
      { $sort: { nbVues: -1 } },
      { $limit: 8 },
      { $project: RESULTS_PROJECTION },
    ]);
  }

  return [];
};

/**
 * Core search computation, callable from both the API route handler and getServerSideProps.
 * Follows the same pattern as computeSearchCounts in /api/search/counts.ts.
 */
export const computeSearchResults = async (
  conn: any,
  queryParams: QueryParams,
  options: SearchResultsOptions,
): Promise<SearchResponse> => {
  const Dispositif =
    conn.models.Dispositif ||
    conn.model("Dispositif", new mongoose.Schema({}, { strict: false, collection: "dispositifs" }));

  const algoliaIds = await resolveAlgoliaIds(queryParams.search);
  const baseMatch = buildBaseMatch(queryParams, algoliaIds);

  if (options.type && options.type !== "all") {
    baseMatch.typeContenu = options.type;
  }

  const aggregation = buildSearchAggregation(baseMatch, options);

  const [results, total, typeCounts, suggestions] = await Promise.all([
    Dispositif.aggregate(aggregation),
    Dispositif.countDocuments(baseMatch),
    Dispositif.aggregate([
      { $match: baseMatch },
      { $group: { _id: "$typeContenu", count: { $sum: 1 } } },
    ]),
    buildSuggestionsQuery(Dispositif, baseMatch, queryParams),
  ]);

  const getCount = (type: string) => typeCounts.find((t: any) => t._id === type)?.count || 0;

  return {
    results,
    suggestions,
    total,
    programCount: getCount("dispositif"),
    procedureCount: getCount("demarche"),
    onlineCount: getCount("online"),
    page: options.page,
    pageCount: Math.ceil(total / options.limit),
  };
};
