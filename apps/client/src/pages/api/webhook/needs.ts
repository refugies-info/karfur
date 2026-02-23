import type { NextApiRequest, NextApiResponse } from "next";
import {
  getWebhookModels,
  standardErrorResponse,
  validateSourceIP,
  validateWebhookSecret,
} from "~/lib/webhookUtils";

interface NeedDocument {
  _id: string;
  fr?: { text: string };
  theme?: { _id: string } | string;
}

const getThemeId = (theme: NeedDocument["theme"]): string | undefined => {
  if (!theme) return undefined;
  if (typeof theme === "string") return theme;
  return theme._id;
};

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
    const { Need } = await getWebhookModels();
    const needs = await Need.find({}).sort({ position: 1 }).select("_id fr.text theme");

    return res.status(200).json(
      needs.map((n: NeedDocument) => ({
        id: n._id,
        name: n.fr?.text,
        themeId: getThemeId(n.theme),
      })),
    );
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
