import { DispositifStatus } from "@refugies-info/api-types";
import type { NextApiRequest, NextApiResponse } from "next";
import { DispositifUpdateSchema } from "~/lib/webhookSchemas";
import {
  checkWebhookPermissions,
  getThemeIdsByNames,
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
  const result = DispositifUpdateSchema.safeParse(req.body);
  if (!result.success) {
    console.error("[Webhook] Validation error:", JSON.stringify(result.error.flatten(), null, 2));
    return res.status(400).json({
      message: "Invalid payload",
      errors: result.error.flatten(),
    });
  }
  const { email, dispositif } = result.data;

  try {
    const { User, Dispositif, Theme } = await getWebhookModels();
    const user = await getWebhookUser(User, email);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé pour cet email" });
    }

    if (!checkWebhookPermissions(user, "update")) {
      return res.status(403).json({ message: "Accès refusé. Rôle requis : Admin ou Contrib" });
    }

    const { _id } = dispositif;

    // Resolve themes from names if provided
    let themeId: any;
    let secondaryThemeIds: any[] = [];
    if (dispositif.themes && Array.isArray(dispositif.themes)) {
      const themeIds = await getThemeIdsByNames(Theme, dispositif.themes);
      if (themeIds.length > 0) {
        themeId = themeIds[0];
        secondaryThemeIds = themeIds.slice(1);
      }
    }

    // Prepare update payload, preserving original creator and creation date
    const { themes, ...dispositifWithoutMetadata } = dispositif;
    const updatePayload: any = {
      ...dispositifWithoutMetadata,
      lastModificationDate: new Date(),
      lastModificationAuthor: user._id,
      translations: {
        ...(dispositif.translations || {}),
        fr: {
          ...((dispositif.translations?.fr as any) || {}),
          content: (dispositif.translations?.fr as any)?.content || {},
          validatorId: user._id,
        },
      },
      status: DispositifStatus.ACTIVE,
    };

    if (themeId) updatePayload.theme = themeId;
    if (secondaryThemeIds.length > 0) updatePayload.secondaryThemes = secondaryThemeIds;

    const updatedDispositif = await Dispositif.findByIdAndUpdate(_id, {
      $set: updatePayload,
    });

    if (!updatedDispositif) {
      return res.status(404).json({ message: "Dispositif not found" });
    }

    return res.status(200).json({
      message: "Dispositif updated successfully",
      id: _id,
    });
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
