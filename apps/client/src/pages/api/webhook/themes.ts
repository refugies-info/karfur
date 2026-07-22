import type { NextApiRequest, NextApiResponse } from "next";
import {
  getWebhookModels,
  standardErrorResponse,
  validateSourceIP,
  validateWebhookSecret,
} from "~/lib/webhookUtils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!validateWebhookSecret(req)) {
    return res.status(401).json({ message: "Accès refusé : Secret invalide ou manquant" });
  }

  if (!validateSourceIP(req)) {
    return res.status(403).json({ message: "Accès refusé : IP non autorisée" });
  }

  try {
    const { Theme } = await getWebhookModels();
    const themes = await Theme.find({}).sort({ position: 1 }).select("_id name.fr short.fr colors.color40");

    return res.status(200).json(
      themes.map((t) => ({
        id: String(t._id),
        name: (t.name as Record<string, string> | undefined)?.fr,
        short: (t.short as Record<string, string> | undefined)?.fr,
        color40: (t.colors as Record<string, string> | undefined)?.color40,
      })),
    );
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
