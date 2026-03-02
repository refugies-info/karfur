import { DispositifStatus } from "@refugies-info/api-types";
import type { NextApiRequest, NextApiResponse } from "next";
import { DispositifUpdateSchema } from "~/lib/webhookSchemas";
import {
  checkWebhookPermissions,
  convertMetadatasDates,
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
    const { User, Dispositif } = await getWebhookModels();
    const user = await getWebhookUser(User, email);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé pour cet email" });
    }

    if (!checkWebhookPermissions(user, "update")) {
      return res.status(403).json({ message: "Accès refusé. Rôle requis : Admin ou Contrib" });
    }

    const { _id } = dispositif;

    // Use theme IDs directly (sent by Luna)
    const themeId = dispositif.theme;
    const secondaryThemeIds = dispositif.secondaryThemes || [];

    // Prepare update payload, preserving original creator and creation date
    const { theme, secondaryThemes, ...dispositifData } = dispositif;

    // Convertir les dates ISO en objets Date MongoDB
    let metadatas;
    try {
      metadatas = convertMetadatasDates(dispositif.metadatas);
    } catch (dateError) {
      return res.status(400).json({
        message: "Erreur de format de date dans les métadonnées",
        error: (dateError as Error).message,
      });
    }

    const updatePayload: any = {
      ...dispositifData,
      lastModificationDate: new Date(),
      lastModificationAuthor: user._id,
      metadatas,
      translations: {
        ...(dispositif.translations || {}),
        fr: {
          ...dispositif.translations?.fr,
          content: dispositif.translations?.fr?.content || {},
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
