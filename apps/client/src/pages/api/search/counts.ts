/* eslint-disable @typescript-eslint/no-var-requires */
const algoliasearch = require("algoliasearch");
import { NextApiRequest, NextApiResponse } from "next";
import { AgeOptions, FrenchOptions, PublicOptions, StatusOptions } from "data/searchFilters";
import dbConnect from "../../../lib/db";

// Initialize Algolia client
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "L9HYT1676M",
  process.env.ALGOLIA_ADMIN_KEY || "",
);
const index = searchClient.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX || "dispositifs");

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

const getQueryParamAsArray = (param: string | string[] | undefined): string[] => {
  if (!param) return [];
  return Array.isArray(param) ? param : [param];
};

const buildBaseMatch = (query: any, algoliaIds?: string[]) => {
  const match: any = { status: "Actif" };

  if (algoliaIds) {
    const mongoose = require("mongoose");
    match._id = { $in: algoliaIds.map((id: string) => new mongoose.Types.ObjectId(id)) };
  }

  if (query.departments?.length > 0) {
    match["metadatas.location"] = { $in: query.departments };
  }
  if (query.themes?.length > 0) {
    const mongoose = require("mongoose");
    match["thematiques"] = { $in: query.themes.map((t: string) => new mongoose.Types.ObjectId(t)) };
  }
  if (query.needs?.length > 0) {
    const mongoose = require("mongoose");
    match["besoins"] = { $in: query.needs.map((n: string) => new mongoose.Types.ObjectId(n)) };
  }
  if (query.age?.length > 0) {
    const ageFilters = query.age.map((ageRange: AgeOptions) => {
      const [min, max] = ageRange.split("-").map(Number);
      return { "metadatas.age.from": { $lte: max }, "metadatas.age.to": { $gte: min } };
    });
    match.$and = (match.$and || []).concat({ $or: ageFilters });
  }
  if (query.frenchLevel?.length > 0) {
    match["metadatas.frenchLevel"] = { $in: query.frenchLevel };
  }
  if (query.public?.length > 0) {
    match["metadatas.public"] = { $in: query.public };
  }
  if (query.status?.length > 0) {
    match["status"] = { $in: query.status };
  }
  if (query.language?.length > 0) {
    match["availableLanguages"] = { $in: query.language };
  }

  return match;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SearchCountsResponse | { message: string }>) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const mongoose = await dbConnect();
    const Dispositif = mongoose.models.Dispositif || mongoose.model("Dispositif");

    const queryParams = {
      query: req.query.query as string,
      departments: getQueryParamAsArray(req.query.departments),
      themes: getQueryParamAsArray(req.query.themes),
      needs: getQueryParamAsArray(req.query.needs),
      age: getQueryParamAsArray(req.query.age) as AgeOptions[],
      frenchLevel: getQueryParamAsArray(req.query.frenchLevel) as FrenchOptions[],
      public: getQueryParamAsArray(req.query.public) as PublicOptions[],
      status: getQueryParamAsArray(req.query.status) as StatusOptions[],
      language: getQueryParamAsArray(req.query.language),
    };

    let algoliaIds: string[] | undefined = undefined;
    if (queryParams.query) {
      const searchResults = await index.search(queryParams.query, {
        attributesToRetrieve: ["objectID"],
        hitsPerPage: 1000,
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
                input: ["0-15", "16-25", "26-64", "65+"],
                as: "range",
                cond: {
                  $let: {
                    vars: {
                      min: { $toInt: { $arrayElemAt: [{ $split: ["$$range", "-"] }, 0] } },
                      max: { $toInt: { $arrayElemAt: [{ $split: ["$$range", "-"] }, 1] } },
                    },
                    in: { $and: [{ $lte: ["$metadatas.age.from", "$$max"] }, { $gte: ["$metadatas.age.to", "$$min"] }] },
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

    const facet = Object.entries(facetPipelines).reduce((acc, [key, pipeline]) => {
      const newMatch = { ...baseMatch };
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
      } else if (key === "statuses") {
        delete newMatch.status;
      } else if (key === "languages") {
        delete newMatch.availableLanguages;
      }

      acc[key] = [{ $match: newMatch }, ...pipeline, { $project: { _id: 0, id: { $toString: "$_id" }, count: 1 } }];
      return acc;
    }, {} as any);

    facet.types = [{ $match: baseMatch }, { $group: { _id: "$typeContenu", count: { $sum: 1 } } }];
    facet.total = [{ $match: baseMatch }, { $count: "count" }];

    const results = await Dispositif.aggregate([{ $facet: facet }]);
    const data = results[0];

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
        dispositif: data.types.find((t: any) => t._id === "dispositif")?.count || 0,
        demarche: data.types.find((t: any) => t._id === "demarche")?.count || 0,
        online: data.types.find((t: any) => t._id === "online")?.count || 0,
      },
      total: data.total[0]?.count || 0,
    };

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export default handler;
