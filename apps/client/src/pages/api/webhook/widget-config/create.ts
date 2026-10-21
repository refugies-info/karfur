import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  authorizeWebhookRequest,
  formatZodErrors,
  getAuthorizedWebhookUser,
  getWebhookModels,
  standardErrorResponse,
} from "~/lib/webhookUtils";
import { WidgetConfigCreateSchema } from "~/lib/widgetConfigWebhookSchema";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!authorizeWebhookRequest(req, res, ["POST"])) return;

  const payload = WidgetConfigCreateSchema.safeParse(req.body);
  if (!payload.success) {
    return res
      .status(400)
      .json({ message: "Invalid payload", errors: formatZodErrors(payload.error) });
  }
  const { email, widgetConfig } = payload.data;

  try {
    const { User, WidgetConfig } = await getWebhookModels();
    const user = await getAuthorizedWebhookUser(res, User, email, "create");
    if (!user) return;

    const now = new Date();
    const created = await WidgetConfig.create({
      ...widgetConfig,
      publicId: randomUUID(),
      statusUpdatedAt: now,
    });

    return res.status(201).json({
      message: "Widget config created successfully",
      id: created._id,
      publicId: created.publicId,
    });
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
