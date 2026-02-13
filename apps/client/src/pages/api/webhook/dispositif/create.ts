import { ContentType, DispositifStatus } from "@refugies-info/api-types";
import type { NextApiRequest, NextApiResponse } from "next";
import { DispositifCreateSchema } from "~/lib/webhookSchemas";
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
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!validateWebhookSecret(req)) {
    return res.status(401).json({ message: "Accès refusé : Secret invalide ou manquant" });
  }

  if (!validateSourceIP(req)) {
    return res.status(403).json({ message: "Accès refusé : IP non autorisée" });
  }

  // Zod validation and sanitization
  const result = DispositifCreateSchema.safeParse(req.body);
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

    if (!checkWebhookPermissions(user, "create")) {
      return res.status(403).json({ message: "Accès refusé. Rôle requis : Admin ou Contrib" });
    }

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

    const newDispositif = {
      ...dispositif,
      creatorId: user._id,
      theme: themeId || (dispositif as any).theme,
      secondaryThemes:
        secondaryThemeIds.length > 0 ? secondaryThemeIds : (dispositif as any).secondaryThemes,
      status: DispositifStatus.ACTIVE,
      typeContenu: ContentType.DISPOSITIF,
      created_at: new Date(),
      lastModificationDate: new Date(),
      lastModificationAuthor: user._id,
      origin: dispositif.origin,
      translations: {
        ...dispositif.translations,
        fr: {
          content: (dispositif.translations?.fr as any)?.content || {},
          created_at: new Date(),
          validatorId: user._id,
        },
      },
    };

    const createdDispositif = await Dispositif.create(newDispositif);
    console.log(`[Webhook] Created Dispositif: ${createdDispositif._id}`);

    return res.status(201).json({
      message: "Dispositif created successfully",
      id: createdDispositif._id,
    });
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
