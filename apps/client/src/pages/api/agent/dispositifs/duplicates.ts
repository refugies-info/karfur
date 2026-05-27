import type { NextApiRequest, NextApiResponse } from "next";
import {
  buildDuplicateSearchPipeline,
  type DuplicateSearchCandidate,
  parseDuplicateSearchRequest,
  scoreDuplicateCandidates,
} from "~/lib/agentDuplicateSearch";
import dbConnect from "~/lib/db";
import { executeCachedPipeline, getDispositifModel } from "~/lib/search-helpers";
import { validateWebhookSecret } from "~/lib/webhookUtils";

type DuplicateSearchResponse = {
  query: ReturnType<typeof parseDuplicateSearchRequest>;
  candidates: DuplicateSearchCandidate[];
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<DuplicateSearchResponse | { message: string }>,
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!validateWebhookSecret(req)) {
    return res.status(401).json({ message: "Accès refusé : Secret invalide ou manquant" });
  }

  let query: ReturnType<typeof parseDuplicateSearchRequest>;
  try {
    query = parseDuplicateSearchRequest(req.body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid payload";
    return res.status(400).json({ message });
  }

  try {
    const conn = await dbConnect();
    const Dispositif = getDispositifModel(conn);
    const rawCandidates = await executeCachedPipeline(
      Dispositif.aggregate(buildDuplicateSearchPipeline(query)),
    );

    return res.status(200).json({
      query,
      candidates: scoreDuplicateCandidates(rawCandidates, query),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ message });
  }
};

export default handler;
