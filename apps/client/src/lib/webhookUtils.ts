import { RoleName } from "@refugies-info/api-types";
import crypto from "crypto";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "./db";
import type { WebhookMetadatas, WebhookSession } from "./webhookSchemas";

export const validateWebhookSecret = (req: NextApiRequest) => {
  const secret = req.headers["webhook-secret"];
  const expectedSecret = process.env.WEBHOOK_SECRET;

  if (!secret || !expectedSecret || typeof secret !== "string") {
    return false;
  }

  const secretBuffer = Buffer.from(secret);
  const expectedBuffer = Buffer.from(expectedSecret);

  if (
    secretBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(secretBuffer, expectedBuffer)
  ) {
    return false;
  }

  return true;
};

export const validateSourceIP = (req: NextApiRequest) => {
  const allowedIps = process.env.ALLOWED_WEBHOOK_IPS;
  if (!allowedIps) return true; // Skip if not configured (local dev)

  const xForwardedFor = req.headers["x-forwarded-for"];

  let ip: string | undefined;
  if (typeof xForwardedFor === "string") {
    // On GCP/Vercel, the last IP is the one added by the trusted proxy
    const ips = xForwardedFor.split(",").map((i) => i.trim());
    ip = ips[ips.length - 1];
  } else {
    ip = req.socket.remoteAddress;
  }

  if (!ip) return false;

  const allowedList = allowedIps.split(",").map((i) => i.trim());
  return allowedList.includes(ip);
};

export const getWebhookModels = async () => {
  await dbConnect();

  // Use existing models if they are already registered by the main app
  // or define minimal schemas for the webhook context with strict: false
  const User =
    mongoose.models.User ||
    mongoose.model("User", new mongoose.Schema({}, { strict: false, collection: "users" }));
  const Role =
    mongoose.models.Role ||
    mongoose.model("Role", new mongoose.Schema({}, { strict: false, collection: "roles" }));
  // Use a separate model name to avoid modifying the global Dispositif schema
  // This model uses strict: false for webhook flexibility but doesn't affect the main app
  const WebhookDispositif =
    mongoose.models.WebhookDispositif ||
    mongoose.model(
      "WebhookDispositif",
      new mongoose.Schema(
        {
          typeContenu: String,
          origin: String,
          status: String,
          creatorId: mongoose.Schema.Types.ObjectId,
          theme: mongoose.Schema.Types.ObjectId,
          translations: mongoose.Schema.Types.Mixed,
        },
        { strict: false, collection: "dispositifs" },
      ),
    );
  const Dispositif = WebhookDispositif; // Alias for backward compatibility with handlers
  const Theme =
    mongoose.models.Theme ||
    mongoose.model("Theme", new mongoose.Schema({}, { strict: false, collection: "themes" }));
  const Need =
    mongoose.models.Need ||
    mongoose.model("Need", new mongoose.Schema({}, { strict: false, collection: "needs" }));
  const Log =
    mongoose.models.Log ||
    mongoose.model("Log", new mongoose.Schema({}, { strict: false, collection: "logs" }));

  return { User, Role, Dispositif, Theme, Need, Log };
};

export const checkWebhookPermissions = (
  user: any,
  action: "create" | "update" | "translation" | "archive",
) => {
  if (!user || !user.roles) {
    console.log("[Webhook] Permission check failed: No user or roles");
    return false;
  }

  const userRoles = user.roles.map((r: any) => {
    if (typeof r === "object" && r.nom) return r.nom;
    if (typeof r === "string") return r; // Fallback if roles are strings
    return ""; // Unknown structure
  });

  // ADMIN and CONTRIB have full access
  if (userRoles.includes(RoleName.ADMIN) || userRoles.includes(RoleName.CONTRIB)) {
    return true;
  }

  // EXPERT_TRAD and TRAD can only update translations
  if (
    action === "translation" &&
    (userRoles.includes(RoleName.TRAD) || userRoles.includes(RoleName.EXPERT_TRAD))
  ) {
    return true;
  }

  return false;
};

export const getThemeIdsByNames = async (Theme: mongoose.Model<any>, names: string[]) => {
  if (!names || names.length === 0) return [];
  const themes = await Theme.find({
    "name.fr": { $in: names },
  })
    .collation({ locale: "fr", strength: 2 })
    .select("_id name.fr");

  // Map to maintain order from input names if possible, or just return found ones
  // It's better to map them back to ensure we match the right IDs
  const themeMap = themes.reduce(
    (acc, t) => {
      acc[t.name.fr.toLowerCase()] = t._id;
      return acc;
    },
    {} as Record<string, any>,
  );

  return names.map((name) => themeMap[name.toLowerCase()]).filter((id) => !!id);
};

export const getWebhookUser = async (User: mongoose.Model<any>, email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    console.log(`[Webhook] User not found for email: ${email}`);
    return null;
  }

  // Manually fetch roles because population is unreliable with mixed schemas
  if (user.roles && user.roles.length > 0) {
    const conn = await dbConnect();
    const Role =
      conn.models.Role ||
      conn.model("Role", new mongoose.Schema({ nom: String }, { collection: "roles" }));
    const populatedRoles = await Role.find({ _id: { $in: user.roles } });
    user.roles = populatedRoles;
  }

  console.log(
    `[Webhook] User found: ${user._id} with roles:`,
    (user.roles || []).map((r: any) => r.nom || r),
  );
  return user;
};

export const standardErrorResponse = (res: NextApiResponse, error: unknown) => {
  console.error("[Webhook] Error:", error);
  const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
  return res.status(500).json({ message: "Internal Server Error", error: errorMessage });
};

/**
 * Convertit les dates ISO en objets Date MongoDB pour les métadonnées
 * Gère spécialement les sessions avec leurs dates multiples
 */
export const convertMetadatasDates = (
  metadatas: WebhookMetadatas | undefined,
):
  | (WebhookMetadatas & {
      sessions?: (Omit<
        WebhookSession,
        "startDate" | "endDate" | "registrationStartDate" | "registrationEndDate"
      > & {
        startDate: Date;
        endDate: Date;
        registrationStartDate?: Date;
        registrationEndDate?: Date;
      })[];
    })
  | undefined => {
  if (!metadatas) return undefined;

  const converted = { ...metadatas };

  // Conversion des sessions
  if (converted.sessions && converted.sessions.items && Array.isArray(converted.sessions.items)) {
    converted.sessions = {
      ...converted.sessions,
      items: converted.sessions.items.map((session: WebhookSession, index: number) => {
        try {
          return {
            ...session,
            startDate: new Date(session.startDate),
            endDate: new Date(session.endDate),
            registrationStartDate: session.registrationStartDate
              ? new Date(session.registrationStartDate)
              : undefined,
            registrationEndDate: session.registrationEndDate
              ? new Date(session.registrationEndDate)
              : undefined,
          };
        } catch (err) {
          throw new Error(
            `Erreur de conversion des dates pour la session #${index + 1}: ${(err as Error).message}`,
          );
        }
      }),
    } as any; // sessions.items contiennent maintenant des Date, pas des strings
  }

  return converted as any;
};
