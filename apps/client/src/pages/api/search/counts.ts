/* eslint-disable @typescript-eslint/no-var-requires */
import { searchClient } from "@algolia/client-search";
import { AgeOptions, FrenchOptions, PublicOptions, StatusOptions } from "data/searchFilters";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db";

// Initialize Algolia client
const algoliaClient = searchClient("L9HYT1676M", process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_API_KEY || "");
const indexName =
  (process.env.NEXT_PUBLIC_REACT_APP_ENV === "production"
    ? process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_PROD
    : process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_STG) || "";

// Define types locally
export interface CountItem {
  id: string;
  count: number;
}

interface TypeCounts {
  dispositif: number;
  demarche: number;
  online: number;
}

export interface SearchCountsResponse {
  themes: CountItem[];
  needs: CountItem[];
  frenchLevels: CountItem[];
  ageRanges: CountItem[];
  publics: CountItem[];
  languages: CountItem[];
  statuses: CountItem[];
  types: TypeCounts;
  total: number;
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
  type?: "dispositif" | "demarche" | "online";
}

export const buildBaseMatch = (query: QueryParams, algoliaIds?: string[]) => {
  const match: any = { status: "Actif" };

  if (algoliaIds) {
    match._id = { $in: algoliaIds.map((id: string) => new mongoose.Types.ObjectId(id)) };
  }

  // Optional type filter
  if (query.type && (query.type === "dispositif" || query.type === "demarche" || query.type === "online")) {
    match.typeContenu = query.type;
  }

  const departments = (query.departments ?? []).filter((v) => typeof v === "string" && v.trim().length > 0);
  if (departments.length > 0) {
    // Accept both full tokens (e.g., "67 - Bas-Rhin", "france", "online")
    // and county-only names (e.g., "Bas-Rhin"). For county-only names, match
    // documents whose metadatas.location ends with " - <County>" (case-insensitive).
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tokensOrRegexes = departments.map((dep) => {
      if (dep === "france" || dep === "online" || dep.includes(" - ")) return dep;
      return new RegExp(` \\- ${escapeRegExp(dep)}$`, "i");
    });
    match["metadatas.location"] = { $in: tokensOrRegexes };
  }
  const themes = (query.themes ?? []).filter((v) => typeof v === "string" && v.trim().length > 0);
  if (themes.length > 0) {
    match["thematiques"] = { $in: themes.map((t: string) => new mongoose.Types.ObjectId(t)) };
  }
  const needs = (query.needs ?? []).filter((v) => typeof v === "string" && v.trim().length > 0);
  if (needs.length > 0) {
    match["besoins"] = { $in: needs.map((n: string) => new mongoose.Types.ObjectId(n)) };
  }
  const ages = (query.age ?? []).filter((a): a is AgeOptions => a === "-18" || a === "18-25" || a === "+25");
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
            then: { $toInt: { $ifNull: [{ $arrayElemAt: ["$metadatas.age.ages", 0] }, 0] } },
          },
          { case: { $eq: ["$metadatas.age.type", "lessThan"] }, then: 0 },
        ],
        default: 0,
      },
    } as const;
    const maxAgeExpr = {
      $switch: {
        branches: [
          {
            case: { $eq: ["$metadatas.age.type", "between"] },
            then: { $toInt: { $ifNull: [{ $arrayElemAt: ["$metadatas.age.ages", 1] }, 1000000] } },
          },
          { case: { $eq: ["$metadatas.age.type", "moreThan"] }, then: 1000000 },
          {
            case: { $eq: ["$metadatas.age.type", "lessThan"] },
            then: { $toInt: { $ifNull: [{ $arrayElemAt: ["$metadatas.age.ages", 0] }, 0] } },
          },
        ],
        default: 0,
      },
    } as const;

    const bucketExpr = (range: AgeOptions) => {
      if (range === "-18") return { $and: [{ $lte: [minAgeExpr, 0] }, { $gte: [maxAgeExpr, 17] }] };
      if (range === "18-25") return { $and: [{ $lte: [minAgeExpr, 18] }, { $gte: [maxAgeExpr, 25] }] };
      return { $and: [{ $lte: [minAgeExpr, 25] }, { $gte: [maxAgeExpr, 1000000] }] }; // +25
    };

    match.$and = (match.$and || []).concat({ $expr: { $or: ages.map(bucketExpr) } });
  }
  const frenchLevel = (query.frenchLevel ?? []).filter((x): x is FrenchOptions => x === "a" || x === "b" || x === "c");
  if (frenchLevel.length > 0) {
    // Map FrenchOptions (a/b/c) to concrete levels stored in Mongo
    const expand = (opts: FrenchOptions[]): string[] => {
      const set = new Set<string>();
      for (const o of opts) {
        if (o === "c") {
          // 'c' means advanced; we do not constrain on DB levels for filtering (matches any), so skip adding match
          return [];
        } else if (o === "b") {
          ["A1", "A2", "B1", "B2"].forEach((x) => set.add(x));
        } else if (o === "a") {
          ["alpha", "A1", "A2"].forEach((x) => set.add(x));
        }
      }
      return Array.from(set);
    };
    const expanded = expand(frenchLevel);
    if (expanded.length > 0) {
      match["metadatas.frenchLevel"] = { $in: expanded };
    }
  }
  const publics = (query.public ?? []).filter((v) => typeof v === "string" && v.trim().length > 0);
  if (publics.length > 0) {
    match["metadatas.public"] = { $in: publics };
  }
  const statuses = (query.status ?? []).filter((v) => typeof v === "string" && v.trim().length > 0);
  if (statuses.length > 0) {
    // Filter by refugee statuses stored in metadatas.publicStatus (document status remains constrained to "Actif")
    match["metadatas.publicStatus"] = { $in: statuses };
  }
  const languages = (query.language ?? []).filter((v) => typeof v === "string" && v.trim().length > 0);
  if (languages.length > 0) {
    // Filter by presence of a translation key for each requested language
    match.$or = languages.map((lng) => ({ [`translations.${lng}`]: { $exists: true } }));
  }

  return match;
};

export const buildQueryParams = (query: any): QueryParams => ({
  search: query.query as string,
  departments: getQueryParamAsArray(query.departments),
  themes: getQueryParamAsArray(query.themes),
  needs: getQueryParamAsArray(query.needs),
  age: getQueryParamAsArray(query.age) as AgeOptions[],
  frenchLevel: getQueryParamAsArray(query.frenchLevel) as FrenchOptions[],
  public: getQueryParamAsArray(query.public) as PublicOptions[],
  status: getQueryParamAsArray(query.status) as StatusOptions[],
  language: getQueryParamAsArray(query.language),
  type:
    ((): "dispositif" | "demarche" | "online" | undefined => {
      const raw = Array.isArray(query.type) ? query.type[0] : query.type;
      return raw === "dispositif" || raw === "demarche" || raw === "online" ? raw : undefined;
    })(),
});

export const computeSearchCounts = async (conn: any, queryParams: QueryParams): Promise<SearchCountsResponse> => {
  // Ensure the Dispositif model is registered (use a permissive schema for aggregation-only usage)
  const Dispositif =
    conn.models.Dispositif ||
    conn.model("Dispositif", new mongoose.Schema({}, { strict: false, collection: "dispositifs" }));

  let algoliaIds: string[] | undefined = undefined;
  if (queryParams.search) {
    const searchResults = await algoliaClient.searchSingleIndex({
      indexName,
      searchParams: {
        query: queryParams.search,
        attributesToRetrieve: ["objectID"],
        hitsPerPage: 1000,
      },
    });
    algoliaIds = searchResults.hits.map((hit: { objectID: string }) => hit.objectID);
  }

  const baseMatch = buildBaseMatch(queryParams, algoliaIds);

  const facetPipelines = {
    themes: [{ $unwind: "$thematiques" }, { $group: { _id: "$thematiques", count: { $sum: 1 } } }],
    needs: [{ $unwind: "$besoins" }, { $group: { _id: "$besoins", count: { $sum: 1 } } }],
    frenchLevels: [
      // Map stored levels to categories a/b/c; if no level, count as all ["a","b","c"]
      {
        $addFields: {
          _frenchCats: {
            $setUnion: [
              {
                $map: {
                  input: { $ifNull: ["$metadatas.frenchLevel", []] },
                  as: "lvl",
                  in: {
                    $switch: {
                      branches: [
                        { case: { $in: ["$$lvl", ["alpha", "A1", "A2"]] }, then: "a" },
                        { case: { $in: ["$$lvl", ["B1", "B2"]] }, then: "b" },
                        { case: { $in: ["$$lvl", ["C1", "C2"]] }, then: "c" },
                      ],
                      default: null,
                    },
                  },
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          cats: {
            $cond: [
              { $or: [{ $eq: ["$_frenchCats", []] }, { $eq: [{ $size: "$_frenchCats" }, 0] }] },
              ["a", "b", "c"],
              "$_frenchCats",
            ],
          },
        },
      },
      { $unwind: "$cats" },
      { $group: { _id: "$cats", count: { $sum: 1 } } },
    ],
    publics: [{ $unwind: "$metadatas.public" }, { $group: { _id: "$metadatas.public", count: { $sum: 1 } } }],
    languages: [
      // Transform translations object into array of {k, v}, take keys as language codes
      {
        $project: {
          _langs: {
            $map: {
              input: { $objectToArray: { $ifNull: ["$translations", {}] } },
              as: "t",
              in: "$$t.k",
            },
          },
        },
      },
      { $unwind: "$_langs" },
      { $group: { _id: "$_langs", count: { $sum: 1 } } },
    ],
    // Count refugee statuses in metadatas.publicStatus (normalize to array first)
    statuses: [
      {
        $project: {
          _normStatuses: {
            $cond: [
              { $isArray: "$metadatas.publicStatus" },
              "$metadatas.publicStatus",
              {
                $cond: [
                  { $and: [{ $ne: ["$metadatas.publicStatus", null] }, { $ne: ["$metadatas.publicStatus", ""] }] },
                  ["$metadatas.publicStatus"],
                  [],
                ],
              },
            ],
          },
        },
      },
      { $unwind: "$_normStatuses" },
      { $group: { _id: "$_normStatuses", count: { $sum: 1 } } },
    ],
    ageRanges: [
      {
        $addFields: {
          minAge: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$metadatas.age.type", "between"] },
                  then: { $toInt: { $ifNull: [{ $arrayElemAt: ["$metadatas.age.ages", 0] }, 0] } },
                },
                {
                  case: { $eq: ["$metadatas.age.type", "moreThan"] },
                  then: { $toInt: { $ifNull: [{ $arrayElemAt: ["$metadatas.age.ages", 0] }, 0] } },
                },
                { case: { $eq: ["$metadatas.age.type", "lessThan"] }, then: 0 },
              ],
              default: 0,
            },
          },
          maxAge: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$metadatas.age.type", "between"] },
                  then: { $toInt: { $ifNull: [{ $arrayElemAt: ["$metadatas.age.ages", 1] }, 1000000] } },
                },
                { case: { $eq: ["$metadatas.age.type", "moreThan"] }, then: 1000000 },
                {
                  case: { $eq: ["$metadatas.age.type", "lessThan"] },
                  then: { $toInt: { $ifNull: [{ $arrayElemAt: ["$metadatas.age.ages", 0] }, 0] } },
                },
              ],
              default: 0,
            },
          },
        },
      },
      {
        $project: {
          ageRanges: {
            $setUnion: [
              { $cond: [{ $and: [{ $lte: ["$minAge", 0] }, { $gte: ["$maxAge", 17] }] }, ["-18"], []] },
              { $cond: [{ $and: [{ $lte: ["$minAge", 18] }, { $gte: ["$maxAge", 25] }] }, ["18-25"], []] },
              { $cond: [{ $and: [{ $lte: ["$minAge", 25] }, { $gte: ["$maxAge", 1000000] }] }, ["+25"], []] },
            ],
          },
        },
      },
      { $unwind: "$ageRanges" },
      { $group: { _id: "$ageRanges", count: { $sum: 1 } } },
    ],
  };

  const facet = Object.entries(facetPipelines).reduce(
    (acc, [key, pipeline]) => {
      const newMatch: any = { ...baseMatch };
      if (key === "themes" || key === "needs") {
        // Themes and needs are dependent/hierarchical facets (a selected need implies its parent theme).
        // When computing counts for either facet, drop BOTH filters to avoid self- and cross-filtering bias.
        // Otherwise, selecting a need would trivially constrain theme counts (and vice versa), which isn't useful for facet exploration.
        delete newMatch.thematiques;
        delete newMatch.besoins;
      } else if (key === "ageRanges") {
        delete newMatch.$and;
      } else if (key === "frenchLevels") {
        delete newMatch["metadatas.frenchLevel"];
      } else if (key === "publics") {
        delete newMatch["metadatas.public"];
      } else if (key === "languages") {
        // Remove language filter ($or on translations.<lang>) to avoid self-filtering
        if (newMatch.$or) delete newMatch.$or;
      } else if (key === "statuses") {
        delete newMatch["metadatas.publicStatus"];
      }

      (acc as any)[key] = [
        { $match: newMatch },
        ...(pipeline as unknown as any[]),
        { $project: { _id: 0, id: { $toString: "$_id" }, count: 1 } },
      ];
      return acc;
    },
    {} as Record<string, any[]>,
  );

  (facet as any).types = [{ $match: baseMatch }, { $group: { _id: "$typeContenu", count: { $sum: 1 } } }];
  (facet as any).total = [{ $match: baseMatch }, { $count: "count" }];

  const results = await Dispositif.aggregate([{ $facet: facet }]);
  const data = results[0] || {};

  const response: SearchCountsResponse = {
    themes: data.themes || [],
    needs: data.needs || [],
    frenchLevels: data.frenchLevels || [],
    ageRanges: data.ageRanges || [],
    publics: data.publics || [],
    languages: data.languages || [],
    statuses: data.statuses || [],
    types: {
      dispositif: data.types?.find((t: any) => t._id === "dispositif")?.count || 0,
      demarche: data.types?.find((t: any) => t._id === "demarche")?.count || 0,
      online: data.types?.find((t: any) => t._id === "online")?.count || 0,
    },
    total: data.total?.[0]?.count || 0,
  };

  return response;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SearchCountsResponse | { message: string }>) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const conn = await dbConnect();
    const queryParams = buildQueryParams(req.query);
    const response = await computeSearchCounts(conn, queryParams);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export default handler;
