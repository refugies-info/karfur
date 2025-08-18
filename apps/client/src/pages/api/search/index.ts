import { searchClient } from "@algolia/client-search";
import { SimpleDispositif } from "@refugies-info/api-types";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db";
import { buildBaseMatch, buildQueryParams } from "./counts";

const algoliaClient = searchClient("L9HYT1676M", process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_API_KEY || "");
const indexName =
  (process.env.NEXT_PUBLIC_REACT_APP_ENV === "production"
    ? process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_PROD
    : process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_STG) || "";

export interface SearchResponse {
  results: SimpleDispositif[];
  total: number;
  programCount: number;
  procedureCount: number;
  onlineCount: number;
  page: number;
  pageCount: number;
}

const getSortOptions = (sort: string) => {
  switch (sort) {
    case "date":
      return { "metadatas.updatedAt": -1 };
    case "views":
      return { "metadatas.vues": -1 };
    default:
      return {};
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SearchResponse | { message: string }>) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const conn = await dbConnect();
    const Dispositif =
      conn.models.Dispositif ||
      conn.model("Dispositif", new mongoose.Schema({}, { strict: false, collection: "dispositifs" }));

    const queryParams = buildQueryParams(req.query);
    const { search, type, sort } = req.query;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    let algoliaIds: string[] | undefined = undefined;
    if (search && typeof search === "string") {
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

    const [results, total, typeCounts] = await Promise.all([
      Dispositif.find(baseMatch)
        .sort(getSortOptions(sort as string))
        .skip((page - 1) * limit)
        .limit(limit)
        .select({ title: 1, theme: 1, secondaryThemes: 1, metadatas: 1, typeContenu: 1, _id: 1, status: 1 }),
      Dispositif.countDocuments(baseMatch),
      Dispositif.aggregate([{ $match: baseMatch }, { $group: { _id: "$typeContenu", count: { $sum: 1 } } }]),
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
