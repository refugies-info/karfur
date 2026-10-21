import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectIdSchema } from "~/lib/webhookSchemas";
import {
  authorizeWebhookRequest,
  getWebhookModels,
  standardErrorResponse,
} from "~/lib/webhookUtils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!authorizeWebhookRequest(req, res, ["GET"])) return;

  const payloadId = ObjectIdSchema.safeParse(req.query.id);
  if (!payloadId.success) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const { WidgetConfig } = await getWebhookModels();
    const widgetConfig = await WidgetConfig.findById(payloadId.data).select("-__v").lean();

    if (!widgetConfig) {
      return res.status(404).json({ message: "Widget config not found" });
    }

    return res.status(200).json(widgetConfig);
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
