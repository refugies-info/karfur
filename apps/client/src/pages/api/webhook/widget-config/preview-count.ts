import type { NextApiRequest, NextApiResponse } from "next";
import {
  authorizeWebhookRequest,
  formatZodErrors,
  getWebhookModels,
  standardErrorResponse,
} from "~/lib/webhookUtils";
import { countWidgetFilterMatches } from "~/lib/widgetConfigFilters";
import { WidgetConfigPreviewSchema } from "~/lib/widgetConfigWebhookSchema";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!authorizeWebhookRequest(req, res, ["POST"])) return;

  const payload = WidgetConfigPreviewSchema.safeParse(req.body);
  if (!payload.success) {
    return res
      .status(400)
      .json({ message: "Données invalides", errors: formatZodErrors(payload.error) });
  }

  try {
    const { Dispositif } = await getWebhookModels();
    const count = await countWidgetFilterMatches(Dispositif, payload.data.filters);

    return res.status(200).json({ count });
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
