import type { NextApiRequest, NextApiResponse } from "next";
import {
  authorizeWebhookRequest,
  formatZodErrors,
  getAuthorizedWebhookUser,
  getWebhookModels,
  standardErrorResponse,
} from "~/lib/webhookUtils";
import {
  hasSelectedAndExcludedOverlap,
  WidgetConfigUpdateSchema,
} from "~/lib/widgetConfigWebhookSchema";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!authorizeWebhookRequest(req, res, ["POST", "PATCH"])) return;

  const payload = WidgetConfigUpdateSchema.safeParse(req.body);
  if (!payload.success) {
    return res
      .status(400)
      .json({ message: "Invalid payload", errors: formatZodErrors(payload.error) });
  }
  const { email, widgetConfig } = payload.data;
  const { _id, ...changes } = widgetConfig;

  try {
    const { User, WidgetConfig } = await getWebhookModels();
    const user = await getAuthorizedWebhookUser(res, User, email, "update");
    if (!user) return;

    const existing = await WidgetConfig.findById(_id).lean();
    if (!existing) {
      return res.status(404).json({ message: "Widget config not found" });
    }

    const selectedIds = changes.selectedDispositifIds ?? existing.selectedDispositifIds.map(String);
    const excludedIds = changes.excludedDispositifIds ?? existing.excludedDispositifIds.map(String);
    if (hasSelectedAndExcludedOverlap(selectedIds, excludedIds)) {
      return res.status(400).json({
        message: "Une fiche ne peut pas être à la fois ajoutée manuellement et exclue",
      });
    }

    const now = new Date();
    const statusChanged = changes.status !== undefined && changes.status !== existing.status;

    await WidgetConfig.updateOne(
      { _id },
      {
        $set: {
          ...changes,
          ...(statusChanged && { statusUpdatedAt: now }),
        },
      },
    );

    return res.status(200).json({ message: "Widget config updated successfully", id: _id });
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
