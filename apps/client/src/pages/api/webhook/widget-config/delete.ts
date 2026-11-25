import type { NextApiRequest, NextApiResponse } from "next";
import {
  authorizeWebhookRequest,
  formatZodErrors,
  getAuthorizedWebhookUser,
  getWebhookModels,
  standardErrorResponse,
} from "~/lib/webhookUtils";
import { WidgetConfigDeleteSchema } from "~/lib/widgetConfigWebhookSchema";

const ALREADY_ACTIVE_MESSAGE = "Ce widget a déjà été actif : il ne peut pas être supprimé";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!authorizeWebhookRequest(req, res, ["DELETE"])) return;

  const payload = WidgetConfigDeleteSchema.safeParse(req.body);
  if (!payload.success) {
    return res
      .status(400)
      .json({ message: "Données invalides", errors: formatZodErrors(payload.error) });
  }
  const { email, widgetConfig } = payload.data;
  const { _id } = widgetConfig;

  try {
    const { User, WidgetConfig } = await getWebhookModels();
    const user = await getAuthorizedWebhookUser(res, User, email, "delete");
    if (!user) return;

    const existing = await WidgetConfig.findById(_id).lean();
    if (!existing || existing.status === "deleted") {
      return res.status(404).json({ message: "Configuration de widget introuvable" });
    }
    if (existing.lastTrafficAt) {
      return res.status(409).json({ message: ALREADY_ACTIVE_MESSAGE });
    }

    const { modifiedCount } = await WidgetConfig.updateOne(
      { _id, status: { $ne: "deleted" }, lastTrafficAt: { $exists: false } },
      { $set: { status: "deleted", statusUpdatedAt: new Date() } },
    );
    if (modifiedCount === 0) {
      return res.status(409).json({ message: ALREADY_ACTIVE_MESSAGE });
    }

    return res
      .status(200)
      .json({ message: "Configuration de widget supprimée avec succès", id: _id });
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
