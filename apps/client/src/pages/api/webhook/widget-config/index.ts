import type { NextApiRequest, NextApiResponse } from "next";
import {
  authorizeWebhookRequest,
  getWebhookModels,
  standardErrorResponse,
} from "~/lib/webhookUtils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!authorizeWebhookRequest(req, res, ["GET"])) return;

  try {
    const { WidgetConfig } = await getWebhookModels();
    const widgetConfigs = await WidgetConfig.find()
      .sort({ updatedAt: -1 })
      .select("publicId internalTitle type status structureName updatedAt")
      .lean();

    return res.status(200).json(widgetConfigs);
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
