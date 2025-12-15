import type { SimpleDispositif } from "@refugies-info/api-types";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { buildBaseMatch, buildQueryParams, getSearchClient } from "~/lib/search-helpers";
import dbConnect from "../../../lib/db";

export interface SearchResponse {
  results: SimpleDispositif[];
  total: number;
  programCount: number;
  procedureCount: number;
  onlineCount: number;
  page: number;
  pageCount: number;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse | { message: string }>,
) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const conn = await dbConnect();
    const Dispositif =
      conn.models.Dispositif ||
      conn.model(
        "Dispositif",
        new mongoose.Schema({}, { strict: false, collection: "dispositifs" }),
      );

    const queryParams = buildQueryParams(req.query);
    const { search, type, sort } = req.query;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    let algoliaIds: string[] | undefined;
    if (search && typeof search === "string") {
      const { algoliaClient, indexName } = getSearchClient();
      const searchResults = await algoliaClient.searchSingleIndex({
        indexName,
        searchParams: {
          query: search,
          attributesToRetrieve: ["objectID"],
          hitsPerPage: 1000,
        },
      });
      algoliaIds = searchResults.hits.map((hit: { objectID: string }) => hit.objectID);
    }

    const baseMatch = buildBaseMatch(queryParams, algoliaIds);

    if (type && type !== "all") {
      baseMatch.typeContenu = type;
    }

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
    aggregation.push({
      $project: {
        title: 1,
        theme: 1,
        secondaryThemes: 1,
        metadatas: 1,
        typeContenu: 1,
        _id: 1,
        status: 1,
        themeSortIndex: 1,
      },
    });

    const [results, total, typeCounts] = await Promise.all([
      Dispositif.aggregate(aggregation),
      Dispositif.countDocuments(baseMatch),
      Dispositif.aggregate([
        { $match: baseMatch },
        { $group: { _id: "$typeContenu", count: { $sum: 1 } } },
      ]),
    ]);

    const getCount = (type: string) => typeCounts.find((t: any) => t._id === type)?.count || 0;

    res.status(200).json({
      results,
      total,
      programCount: getCount("dispositif"),
      procedureCount: getCount("demarche"),
      onlineCount: getCount("online"),
      page,
      pageCount: Math.ceil(total / limit),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export default handler;
