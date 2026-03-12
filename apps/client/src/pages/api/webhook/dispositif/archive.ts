import { DispositifStatus } from "@refugies-info/api-types";
import type { NextApiRequest, NextApiResponse } from "next";
import { ArchiveSchema } from "~/lib/webhookSchemas";
import {
  checkWebhookPermissions,
  formatZodErrors,
  getWebhookModels,
  getWebhookUser,
  standardErrorResponse,
  validateSourceIP,
  validateWebhookSecret,
} from "~/lib/webhookUtils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST" && req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!validateWebhookSecret(req)) {
    return res.status(401).json({ message: "Accès refusé : Secret invalide ou manquant" });
  }

  if (!validateSourceIP(req)) {
    return res.status(403).json({ message: "Accès refusé : IP non autorisée" });
  }

  // Zod validation and sanitization
  const result = ArchiveSchema.safeParse(req.body);
  if (!result.success) {
    const errors = formatZodErrors(result.error);
    return res.status(400).json({
      message: "Invalid payload",
      errors,
    });
  }
  const { email, dispositif } = result.data;

  try {
    const { User, Dispositif } = await getWebhookModels();
    const user = await getWebhookUser(User, email);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé pour cet email" });
    }

    if (!checkWebhookPermissions(user, "archive")) {
      return res.status(403).json({ message: "Accès refusé. Rôle requis : Admin ou Contrib" });
    }

    const updatedDispositif = await Dispositif.findByIdAndUpdate(dispositif._id, {
      $set: {
        status: DispositifStatus.ARCHIVED,
        lastModificationDate: new Date(),
        lastModificationAuthor: user._id,
      },
    });

    if (!updatedDispositif) {
      return res.status(404).json({ message: "Dispositif not found" });
    }

    return res.status(200).json({
      message: "Dispositif archived successfully",
      id: dispositif._id,
    });
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
