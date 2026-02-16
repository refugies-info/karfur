import type { NextApiRequest, NextApiResponse } from "next";
import archiveHandler from "./archive";
import createHandler from "./create";
import translationHandler from "./translation";
import updateHandler from "./update";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST" && req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { dispositif } = req.body || {};

  if (!dispositif) {
    return res.status(400).json({ message: "Missing dispositif data" });
  }

  // Dispatch based on payload content
  if (dispositif.translationUpdate) {
    return translationHandler(req, res);
  }

  if (dispositif._id) {
    // Check if it's an archive request (if payload is just _id and nothing else, but usually we have specific logic)
    // For now, if it has _id and no translationUpdate, it's an editorial update
    return updateHandler(req, res);
  }

  // No _id, it's a creation
  return createHandler(req, res);
};

export default handler;
