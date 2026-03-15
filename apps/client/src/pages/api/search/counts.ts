import type { Model } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import dbConnect from "~/lib/db";
import {
  buildBaseMatch,
  buildQueryParams,
  executeCachedPipeline,
  getDispositifModel,
  getSearchClient,
  type QueryParams,
} from "~/lib/search-helpers";

// Define types locally
interface CountItem {
  id: string;
  count: number;
}

interface TypeCounts {
  dispositif: number;
  demarche: number;
  online: number;
}

export interface SearchCountsResponse {
  themes: Record<string, number>;
  needs: Record<string, number>;
  frenchLevels: Record<string, number>;
  ageRanges: Record<string, number>;
  publics: Record<string, number>;
  languages: Record<string, number>;
  statuses: Record<string, number>;
  types: TypeCounts;
  total: number;
}

export const computeSearchCounts = async (
  conn: {
    models: Record<string, Model<any>>;
    model?: (name: string, schema?: any, collection?: string) => Model<any>;
  },
  queryParams: QueryParams,
): Promise<SearchCountsResponse> => {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return {
      themes: {},
      needs: {},
      frenchLevels: {},
      ageRanges: {},
      publics: {},
      languages: {},
      statuses: {},
      types: { dispositif: 0, demarche: 0, online: 0 },
      total: 0,
    };
  }

  const Dispositif = getDispositifModel(conn);

  let algoliaIds: string[] | undefined;
  if (queryParams.search) {
    const { algoliaClient, indexName } = getSearchClient();
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
    themes: [
      {
        $project: {
          _allThemes: {
            $setUnion: [
              // theme is a single ObjectId; normalize to array if present
              {
                $ifNull: [
                  {
                    $cond: [{ $ne: ["$theme", null] }, ["$theme"], []],
                  },
                  [],
                ],
              },
              { $ifNull: ["$secondaryThemes", []] },
              // keep legacy field support if present
              { $ifNull: ["$thematiques", []] },
            ],
          },
        },
      },
      { $unwind: "$_allThemes" },
      { $group: { _id: "$_allThemes", count: { $sum: 1 } } },
    ],
    needs: [
      {
        $project: {
          _allNeeds: {
            $ifNull: ["$needs", []],
          },
          _themeIds: {
            $setUnion: [
              // main theme is a single ObjectId -> wrap into array if present then stringify
              {
                $cond: [{ $ne: ["$theme", null] }, [{ $toString: "$theme" }], []],
              },
              // secondaryThemes is an array of ObjectIds -> stringify
              {
                $map: {
                  input: { $ifNull: ["$secondaryThemes", []] },
                  as: "t",
                  in: { $toString: "$$t" },
                },
              },
              // legacy field already an array of string ids
              { $ifNull: ["$thematiques", []] },
            ],
          },
        },
      },
      { $unwind: "$_allNeeds" },
      {
        $lookup: {
          from: "needs",
          localField: "_allNeeds",
          foreignField: "_id",
          as: "needDoc",
        },
      },
      { $unwind: "$needDoc" },
      {
        $match: {
          $expr: {
            $in: [{ $toString: "$needDoc.theme" }, "$_themeIds"],
          },
        },
      },
      { $group: { _id: "$_allNeeds", count: { $sum: 1 } } },
    ],
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
    publics: [
      { $unwind: "$metadatas.public" },
      { $group: { _id: "$metadatas.public", count: { $sum: 1 } } },
    ],
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
                  {
                    $and: [
                      { $ne: ["$metadatas.publicStatus", null] },
                      { $ne: ["$metadatas.publicStatus", ""] },
                    ],
                  },
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
                  then: {
                    $toInt: { $ifNull: [{ $arrayElemAt: ["$metadatas.age.ages", 1] }, 1000000] },
                  },
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
              {
                $cond: [
                  { $and: [{ $lte: ["$minAge", 0] }, { $gte: ["$maxAge", 17] }] },
                  ["-18"],
                  [],
                ],
              },
              {
                $cond: [
                  { $and: [{ $lte: ["$minAge", 18] }, { $gte: ["$maxAge", 25] }] },
                  ["18-25"],
                  [],
                ],
              },
              {
                $cond: [
                  { $and: [{ $lte: ["$minAge", 25] }, { $gte: ["$maxAge", 1000000] }] },
                  ["+25"],
                  [],
                ],
              },
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
      // IMPORTANT: Rebuild base match with the corresponding facet filter removed
      // rather than mutating a shallow copy. Some filters are embedded in $or/$and expressions
      // (e.g., themes/needs in $or, frenchLevel in $and/$expr). Rebuilding guarantees removal.
      let matchForFacet: any = baseMatch;
      if (key === "themes" || key === "needs") {
        matchForFacet = buildBaseMatch({ ...queryParams, themes: [], needs: [] }, algoliaIds);
      } else if (key === "ageRanges") {
        matchForFacet = buildBaseMatch({ ...queryParams, age: [] }, algoliaIds);
      } else if (key === "frenchLevels") {
        matchForFacet = buildBaseMatch({ ...queryParams, frenchLevel: [] }, algoliaIds);
      } else if (key === "publics") {
        matchForFacet = buildBaseMatch({ ...queryParams, public: [] }, algoliaIds);
      } else if (key === "languages") {
        matchForFacet = buildBaseMatch({ ...queryParams, language: [] }, algoliaIds);
      } else if (key === "statuses") {
        matchForFacet = buildBaseMatch({ ...queryParams, status: [] }, algoliaIds);
      }

      (acc as any)[key] = [
        { $match: matchForFacet },
        ...(pipeline as unknown as any[]),
        { $project: { _id: 0, id: { $toString: "$_id" }, count: 1 } },
      ];
      return acc;
    },
    {} as Record<string, any[]>,
  );

  (facet as any).types = [
    { $match: baseMatch },
    { $group: { _id: "$typeContenu", count: { $sum: 1 } } },
  ];
  (facet as any).total = [{ $match: baseMatch }, { $count: "count" }];

  const results = await executeCachedPipeline(Dispositif.aggregate([{ $facet: facet }]));
  const data = results[0] || {};

  const toMap = (arr: Array<{ id: string; count: number }> | undefined): Record<string, number> => {
    const map: Record<string, number> = {};
    for (const item of arr || []) {
      // Prefer string keys; ensure defined id
      if (item && typeof item.id === "string") {
        map[item.id] = item.count ?? 0;
      }
    }
    return map;
  };

  const response: SearchCountsResponse = {
    themes: toMap(data.themes),
    needs: toMap(data.needs),
    frenchLevels: toMap(data.frenchLevels),
    ageRanges: toMap(data.ageRanges),
    publics: toMap(data.publics),
    languages: toMap(data.languages),
    statuses: toMap(data.statuses),
    types: {
      dispositif: data.types?.find((t: any) => t._id === "dispositif")?.count || 0,
      demarche: data.types?.find((t: any) => t._id === "demarche")?.count || 0,
      online: data.types?.find((t: any) => t._id === "online")?.count || 0,
    },
    total: data.total?.[0]?.count || 0,
  };

  return response;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchCountsResponse | { message: string }>,
) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Check if the search counts API is disabled via environment variable
  if (process.env.DISABLE_SEARCH_COUNTS === "true") {
    return res.status(503).json({ message: "Search counts temporarily unavailable" });
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
