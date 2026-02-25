import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "~/lib/db";
import { buildQueryParams, computeSearchResults, type SearchResponse } from "~/lib/search-helpers";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse | { message: string }>,
) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const conn = await dbConnect();
    const queryParams = buildQueryParams(req.query);
    const { type, sort } = req.query;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const response = await computeSearchResults(conn, queryParams, {
      page,
      limit,
      type: typeof type === "string" ? type : undefined,
      sort: typeof sort === "string" ? sort : undefined,
    });

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export default handler;
