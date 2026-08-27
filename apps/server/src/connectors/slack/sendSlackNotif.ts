import { IncomingWebhook } from "@slack/webhook";
import logger from "~/logger";

const webhookUrl = process.env.SLACK_WEBHOOK_URL;
const webhook = webhookUrl ? new IncomingWebhook(webhookUrl) : null;

export const sendSlackNotif = async (title: string, text: string, link: string) => {
  if (process.env.NODE_ENV === "dev") {
    logger.info("[sendSlackNotif] notif not sent in DEV: ", { title, text, link });
    return;
  }
  logger.info("[sendSlackNotif] send notif: ", { title, text, link });
  const prefix = process.env.NODE_ENV === "staging" ? "[STAGING] " : "";
  try {
    await webhook?.send({
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `${prefix}${title}`,
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: text,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: ":point_right: Consulter la fiche",
                emoji: true,
              },
              url: link,
            },
          ],
        },
      ],
    });
  } catch (e) {
    logger.error("[sendSlackNotif] error", e);
  }
};

export const slackDeletedAccount = async (email: string) => {
  if (process.env.NODE_ENV === "dev") {
    logger.info("[sendSlackNotif] notif not sent in DEV: ", { email });
    return;
  }
  logger.info("[sendSlackNotif] send notif: ", { email });
  const prefix = process.env.NODE_ENV === "staging" ? "[STAGING] " : "";
  try {
    await webhook?.send({
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `${prefix} :x: Un utilisateur a supprimé son compte`,
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `L'utilisateur avec l'adresse mail ${email} a supprimé son compte via son espace personnel`,
          },
        },
      ],
    });
  } catch (e) {
    logger.error("[sendSlackNotif] error", e);
  }
};

/** Slack interprète `&`, `<` et `>` : un message d'erreur brut pourrait y injecter un lien. */
const escapeMrkdwn = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Les messages de validation embarquent parfois la valeur refusée en entier. */
const truncate = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max)}…` : value;

const code = (value: string, max = 300) => `\`${escapeMrkdwn(truncate(value, max))}\``;

/** Formate un volume d'octets en unité lisible (« 1,2 Mo »). */
const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} o`;
  const units = ["ko", "Mo", "Go"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toLocaleString("fr-FR", {
    maximumFractionDigits: value < 10 ? 1 : 0,
  })} ${units[unit]}`;
};

/** Les littéraux `type` doivent rester étroits pour correspondre au bloc `actions` de Slack. */
interface SlackLinkButton {
  type: "button";
  text: { type: "plain_text"; text: string; emoji: boolean };
  url: string;
}

interface ClientErrorNotif {
  reference: string;
  source: string;
  status?: number | null;
  message: string;
  fields?: { path: string; reason?: string; excessProperty?: string; readableReason?: string }[];
  payloadSize?: { bytes: number; limitBytes: number };
  dispositifId?: string | null;
  /** Type de contenu, résolu côté serveur : sert à construire des liens de confiance. */
  typeContenu?: "dispositif" | "demarche" | null;
  dispositifTitle?: string | null;
  locale?: string;
  url?: string;
  userAgent?: string;
  sentryEventId?: string | null;
  username?: string;
  email?: string;
}

/**
 * Notifie l'équipe technique d'une erreur survenue dans le navigateur. La `reference` est celle
 * affichée dans la modale : elle est le seul lien entre la personne qui appelle le support et
 * cette notification, donc elle doit rester en tête du message.
 */
export const slackClientError = async (error: ClientErrorNotif) => {
  const frontUrl = process.env.FRONT_SITE_URL;
  const lines = [
    `*Référence* : ${code(error.reference, 64)}`,
    `*Origine* : ${code(error.source, 64)}`,
    `*Code* : ${error.status ?? "aucun (pas de réponse HTTP)"}`,
    `*Message* : ${code(error.message)}`,
  ];

  if (error.fields?.length) {
    lines.push("*Champs refusés* :");
    for (const field of error.fields.slice(0, 10)) {
      // La propriété en trop d'abord : sur un champ typé en union, tsoa noie le vrai motif
      // dans « Could not match the union », illisible tel quel.
      const excess = field.excessProperty
        ? ` — propriété en trop : ${code(field.excessProperty, 80)}`
        : "";
      const readable = field.readableReason ? ` (${field.readableReason})` : "";
      lines.push(`• ${code(field.path, 120)}${excess}${readable}`);
      if (field.reason) lines.push(`   ↳ motif brut : ${code(field.reason, 600)}`);
    }
  }

  if (error.payloadSize) {
    lines.push(
      `*Volume envoyé* : ${formatBytes(error.payloadSize.bytes)} (maximum accepté : ${formatBytes(
        error.payloadSize.limitBytes,
      )})`,
    );
  }

  if (error.dispositifTitle) lines.push(`*Fiche* : ${code(error.dispositifTitle, 200)}`);
  if (error.username || error.email) {
    lines.push(`*Utilisateur* : ${code(`${error.username ?? "?"} <${error.email ?? "?"}>`, 120)}`);
  }
  if (error.locale) lines.push(`*Langue* : ${code(error.locale, 16)}`);
  // Affichée en texte, jamais en lien : c'est une valeur fournie par le navigateur.
  if (error.url) lines.push(`*Page* : ${code(error.url, 300)}`);
  if (error.userAgent) lines.push(`*Navigateur* : ${code(error.userAgent, 200)}`);
  if (error.sentryEventId) lines.push(`*Sentry* : ${code(error.sentryEventId, 64)}`);

  const text = lines.join("\n");

  if (process.env.NODE_ENV === "dev") {
    logger.info("[slackClientError] notif not sent in DEV: ", { text });
    return;
  }
  logger.info("[slackClientError] send notif: ", { reference: error.reference });

  const prefix = process.env.NODE_ENV === "staging" ? "[STAGING] " : "";
  // Les URL des boutons sont reconstruites à partir de `FRONT_SITE_URL` et du type résolu en
  // base : le lien envoyé par le navigateur ne sert qu'à l'affichage.
  const actions: SlackLinkButton[] = [];
  if (error.dispositifId && error.typeContenu && frontUrl) {
    const fiche = `${frontUrl}/fr/${error.typeContenu}/${error.dispositifId}`;
    actions.push(
      {
        type: "button",
        text: { type: "plain_text", text: ":point_right: Consulter la fiche", emoji: true },
        url: fiche,
      },
      {
        type: "button",
        text: { type: "plain_text", text: ":pencil2: Ouvrir l'éditeur", emoji: true },
        url: `${fiche}/edit`,
      },
    );
  }

  try {
    await webhook?.send({
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `${prefix}:rotating_light: Erreur côté navigateur`,
            emoji: true,
          },
        },
        { type: "section", text: { type: "mrkdwn", text } },
        ...(actions.length > 0 ? [{ type: "actions" as const, elements: actions }] : []),
      ],
    });
  } catch (e) {
    logger.error("[slackClientError] error", e);
  }
};
