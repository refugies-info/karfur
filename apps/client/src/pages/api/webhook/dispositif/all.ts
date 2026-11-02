import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { ObjectIdSchema } from "~/lib/webhookSchemas";
import {
  authorizeWebhookRequest,
  formatZodErrors,
  getWebhookModels,
  standardErrorResponse,
} from "~/lib/webhookUtils";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

const QuerySchema = z.object({
  cursor: ObjectIdSchema.optional(),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!authorizeWebhookRequest(req, res, ["GET"])) return;

  const payload = QuerySchema.safeParse(req.query);
  if (!payload.success) {
    return res
      .status(400)
      .json({ message: "Requête invalide", errors: formatZodErrors(payload.error) });
  }
  const { cursor, limit } = payload.data;

  try {
    const { Dispositif } = await getWebhookModels();

    const dispositifs = await Dispositif.find(cursor ? { _id: { $gt: cursor } } : {})
      .sort({ _id: 1 })
      .limit(limit + 1)
      .select("-__v")
      .lean();

    const items = dispositifs.slice(0, limit);
    const nextCursor = dispositifs.length > limit ? String(items[items.length - 1]._id) : null;

    return res.status(200).json({ items, nextCursor });
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
