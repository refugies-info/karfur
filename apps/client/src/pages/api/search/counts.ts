/* eslint-disable @typescript-eslint/no-var-requires */
import { searchClient } from "@algolia/client-search";
import { AgeOptions, FrenchOptions, PublicOptions, StatusOptions } from "data/searchFilters";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db";

// Initialize Algolia client
const algoliaClient = searchClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "L9HYT1676M",
  process.env.ALGOLIA_ADMIN_KEY || "",
);
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX || "dispositifs";

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
  departments: CountItem[];
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
  query?: string;
  departments?: string[];
  themes?: string[];
  needs?: string[];
  age?: AgeOptions[];
  frenchLevel?: FrenchOptions[];
  public?: PublicOptions[];
  status?: StatusOptions[];
  language?: string[];
}

export const buildBaseMatch = (query: QueryParams, algoliaIds?: string[]) => {
  const match: any = { status: "Actif" };

  if (algoliaIds) {
    match._id = { $in: algoliaIds.map((id: string) => new mongoose.Types.ObjectId(id)) };
  }

  const departments = query.departments ?? [];
  if (departments.length > 0) {
    match["metadatas.location"] = { $in: query.departments };
  }
  const themes = query.themes ?? [];
  if (themes.length > 0) {
    match["thematiques"] = { $in: themes.map((t: string) => new mongoose.Types.ObjectId(t)) };
  }
  const needs = query.needs ?? [];
  if (needs.length > 0) {
    match["besoins"] = { $in: needs.map((n: string) => new mongoose.Types.ObjectId(n)) };
  }
  const ages = query.age ?? [];
  if (ages.length > 0) {
    const ageFilters = ages.map((ageRange: AgeOptions) => {
      if (String(ageRange) === "65+") {
        return { "metadatas.age.to": { $gte: 65 } };
      }
      const [min, max] = ageRange.split("-").map(Number);
      return { "metadatas.age.from": { $lte: max }, "metadatas.age.to": { $gte: min } };
    });
    match.$and = (match.$and || []).concat({ $or: ageFilters });
  }
  const frenchLevel = query.frenchLevel ?? [];
  if (frenchLevel.length > 0) {
    match["metadatas.frenchLevel"] = { $in: frenchLevel };
  }
  const publics = query.public ?? [];
  if (publics.length > 0) {
    match["metadatas.public"] = { $in: publics };
  }
  const statuses = query.status ?? [];
  if (statuses.length > 0) {
    match["status"] = { $in: statuses };
  }
  const languages = query.language ?? [];
  if (languages.length > 0) {
    match["availableLanguages"] = { $in: languages };
  }

  return match;
};

export const buildQueryParams = (query: any): QueryParams => ({
  query: query.query as string,
  departments: getQueryParamAsArray(query.departments),
  themes: getQueryParamAsArray(query.themes),
  needs: getQueryParamAsArray(query.needs),
  age: getQueryParamAsArray(query.age) as AgeOptions[],
  frenchLevel: getQueryParamAsArray(query.frenchLevel) as FrenchOptions[],
  public: getQueryParamAsArray(query.public) as PublicOptions[],
  status: getQueryParamAsArray(query.status) as StatusOptions[],
  language: getQueryParamAsArray(query.language),
});

export const computeSearchCounts = async (conn: any, queryParams: QueryParams): Promise<SearchCountsResponse> => {
  const Dispositif = conn.models.Dispositif || conn.model("Dispositif");

  let algoliaIds: string[] | undefined = undefined;
  if (queryParams.query) {
    const searchResults = await algoliaClient.searchSingleIndex({
      indexName,
      searchParams: {
        query: queryParams.query,
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
    departments: [{ $unwind: "$metadatas.location" }, { $group: { _id: "$metadatas.location", count: { $sum: 1 } } }],
    frenchLevels: [
      { $unwind: "$metadatas.frenchLevel" },
      { $group: { _id: "$metadatas.frenchLevel", count: { $sum: 1 } } },
    ],
    publics: [{ $unwind: "$metadatas.public" }, { $group: { _id: "$metadatas.public", count: { $sum: 1 } } }],
    languages: [{ $unwind: "$availableLanguages" }, { $group: { _id: "$availableLanguages", count: { $sum: 1 } } }],
    statuses: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
    ageRanges: [
      {
        $project: {
          ageRanges: {
            $filter: {
              input: ["0-5", "6-10", "11-13", "14-15", "16-17", "18-25", "26-64", "65+"],
              as: "range",
              cond: {
                $let: {
                  vars: {
                    min: {
                      $cond: [
                        { $eq: ["$$range", "65+"] },
                        65,
                        { $toInt: { $arrayElemAt: [{ $split: ["$$range", "-"] }, 0] } },
                      ],
                    },
                    max: {
                      $cond: [
                        { $eq: ["$$range", "65+"] },
                        null,
                        { $toInt: { $arrayElemAt: [{ $split: ["$$range", "-"] }, 1] } },
                      ],
                    },
                  },
                  in: {
                    $cond: {
                      if: { $eq: ["$$range", "65+"] },
                      then: { $gte: ["$metadatas.age.to", 65] },
                      else: {
                        $and: [{ $lte: ["$metadatas.age.from", "$$max"] }, { $gte: ["$metadatas.age.to", "$$min"] }],
                      },
                    },
                  },
                },
              },
            },
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
        delete newMatch.thematiques;
        delete newMatch.besoins;
      } else if (key === "departments") {
        delete newMatch["metadatas.location"];
      } else if (key === "ageRanges") {
        delete newMatch.$and;
      } else if (key === "frenchLevels") {
        delete newMatch["metadatas.frenchLevel"];
      } else if (key === "publics") {
        delete newMatch["metadatas.public"];
      } else if (key === "languages") {
        delete newMatch.availableLanguages;
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
    departments: data.departments || [],
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
