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
