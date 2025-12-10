import { ContentType, type Languages } from "@refugies-info/api-types";
import {
  type AppUser,
  type Dispositif,
  type DispositifId,
  type Notification,
  NotificationModel,
} from "@refugies-info/mongo";
import { Expo, type ExpoPushMessage, type ExpoPushTicket } from "expo-server-sdk";
import uniq from "lodash/uniq";
import { availableLanguages } from "~/libs/getFormattedLocale";
import { getLocaleString as t } from "~/libs/getLocaleString";
import logger from "~/logger";
import { processAppUsersByBatch } from "~/modules/appusers/appusers.repository";
import {
  getDispositifTranslated,
  isDemarche,
  isDispositif,
} from "~/modules/dispositif/dispositif.business";
import {
  getDispositifById,
  updateDispositifInDB,
} from "~/modules/dispositif/dispositif.repository";
import { getAdminOption } from "../adminOptions/adminOptions.repository";
import {
  filterTargets,
  filterTargetsForDemarche,
  getNotificationEmoji,
  parseDispositif,
  type Requirements,
} from "./helpers";

export const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

/**
 * Returns appusers uid which have more than maxNotifs in the last nbDays
 * @param nbDays
 * @param maxNotifs
 * @returns uid of the appuser and nb notifs sent
 */
const getUserMaxNotifs = (
  nbDays: number,
  maxNotifs: number,
): Promise<{ _id: string; count: number }[]> => {
  return NotificationModel.aggregate([
    {
      $match: {
        $expr: {
          $gte: [
            "$createdAt",
            {
              $add: [new Date(), -1000 * 60 * 60 * 24 * nbDays],
            },
          ],
        },
      },
    },
    {
      $group: { _id: "$uid", count: { $sum: 1 } },
    },
    {
      $match: {
        count: { $gte: maxNotifs },
      },
    },
  ]);
};

/**
 * returns uids of appusers which should not receive notifications
 * @returns
 */
export const getUsersNotifsNotAllowed = async (): Promise<string[]> => {
  const usersLastDay = await getUserMaxNotifs(1, 3);
  const usersLastWeek = await getUserMaxNotifs(7, 7);
  return uniq([...usersLastDay.map((u) => u._id), ...usersLastWeek.map((u) => u._id)]);
};

export const getNotificationsToSend = async (
  notifications: Notification[],
  tokens: Record<string, string>,
) => {
  const usersNotAllowed: string[] = []; // await getUsersNotifsNotAllowed(); // FIXME: temporary removed to send survey to TS
  const messages: ExpoPushMessage[] = notifications
    .map((notification) => {
      if (usersNotAllowed.includes(notification.uid)) return null;
      return {
        to: tokens[notification.uid],
        title: "Réfugiés.info",
        body: notification.title,
        data: {
          ...notification.data,
          notificationId: notification._id.toString(),
        },
      };
    })
    .filter((message) => message?.to);

  return messages;
};

export const isNotificationsActive = async () => {
  const adminOption = await getAdminOption("activesNotifications");
  return !adminOption || adminOption.value === true;
};

export const getNotificationsForUser = async (uid: string) => {
  const notifications = await NotificationModel.find({ uid }).limit(15).sort({ createdAt: -1 });
  return notifications;
};

export const markNotificationAsSeen = async (notificationId: string, uid: string) => {
  try {
    const notification = await NotificationModel.findOne({ _id: notificationId, uid });
    if (notification) {
      notification.seen = true;
      await notification.save();
    }
    return true;
  } catch (error) {
    logger.error("[markNotificationAsSeen] error while marking notification as seen", {
      error: error.message,
    });
    return false;
  }
};

export const sendNotifications = async (messages: ExpoPushMessage[]) => {
  const pushTickets: ExpoPushTicket[] = [];
  const notificationActive = await isNotificationsActive();

  // already added in sendDispositifNotifications but replicated here
  // to be more secure if new feature in the future
  if (notificationActive) {
    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        pushTickets.push(...ticketChunk);
      } catch (error) {
        logger.error("[sendNotifications]", error);
      }
    }
  }

  return pushTickets;
};

const sendDispositifNotificationsBatch = async (
  users: AppUser[],
  dispositif: Dispositif,
  requirements: Requirements,
  lang: Languages,
) => {
  const dispositifId = dispositif._id;

  const targetUsers = filterTargets(users, requirements, lang);

  logger.info(
    `[sendDispositifNotificationsBatch] dispositif ${dispositifId} - ${targetUsers.length} users found`,
  );

  const tokens = {} as Record<string, string>;
  targetUsers.forEach((user) => {
    if (user.expoPushToken) {
      tokens[user.uid] = user.expoPushToken;
    }
  });

  const savedNotifications = await NotificationModel.insertMany(
    targetUsers.map((user) => {
      return {
        uid: user.uid,
        seen: false,
        title: `${getNotificationEmoji(dispositif)} ${t(
          lang,
          "notifications.newOffer",
        )} - ${getDispositifTranslated(dispositif, "content.titreInformatif", lang)} ${t(
          lang,
          "notifications.with",
        )} ${getDispositifTranslated(dispositif, "content.titreMarque", lang)}`,
        data: {
          type: ContentType.DISPOSITIF,
          contentId: dispositif._id.toString(),
        },
      };
    }),
  );

  const messages = await getNotificationsToSend(savedNotifications, tokens);
  await sendNotifications(messages);

  const payload = dispositif?.notificationsSent || {};
  payload[lang] = true;
  await updateDispositifInDB(dispositifId, { notificationsSent: payload });
};

export const sendDispositifNotifications = async (dispositifId: DispositifId, lang: Languages) => {
  const notificationActive = await isNotificationsActive();
  if (notificationActive) {
    logger.info("[sendDispositifNotifications] notifications actives");
    try {
      const dispositif = await getDispositifById(
        dispositifId,
        {
          status: 1,
          translations: 1,
          typeContenu: 1,
          theme: 1,
          notificationsSent: 1,
          metadatas: 1,
        },
        "theme",
      );

      if (!dispositif) {
        logger.error(`[sendDispositifNotifications] dispositif ${dispositifId} not found`);
        return;
      }

      /*
       * Pas de mail si ce n'est pas un dispositif
       */
      if (!isDispositif(dispositif)) {
        return;
      }

      if (dispositif.notificationsSent && dispositif.notificationsSent[lang]) {
        logger.info(
          `[sendDispositifNotifications] dispositif ${dispositifId} notifications already sent for lang ${lang}`,
        );
        return;
      }

      const requirements = parseDispositif(dispositif);
      if (!requirements) {
        logger.error(
          `[sendDispositifNotifications] dispositif ${dispositifId} - Failed to parse requirements`,
        );
        return;
      }

      await processAppUsersByBatch(100, (users) =>
        sendDispositifNotificationsBatch(users, dispositif, requirements, lang),
      );
    } catch (err) {
      logger.error("[sendDispositifNotifications]", err);
    }
  } else {
    logger.error("[sendDispositifNotifications] not active: nothing sent");
  }
};

const sendDemarcheNotificationsBatch = async (
  users: AppUser[],
  demarche: Dispositif,
  requirements: Requirements,
) => {
  const demarcheId = demarche._id;

  const targetUsers = filterTargetsForDemarche(users, requirements, demarche);

  logger.info(
    `[sendDemarcheNotificationsBatch] demarche ${demarcheId} - ${targetUsers.length} users found`,
  );

  const tokens = {} as Record<string, string>;
  targetUsers.forEach((user) => {
    if (user.expoPushToken) {
      tokens[user.uid] = user.expoPushToken;
    }
  });

  const savedNotifications = await NotificationModel.insertMany(
    targetUsers.map((user) => {
      const lang = user.selectedLanguage || "fr";
      return {
        uid: user.uid,
        seen: false,
        title: `${getNotificationEmoji(demarche)} ${t(lang, "notifications.newOffer")} : ${getDispositifTranslated(
          demarche,
          "content.titreInformatif",
          lang,
        )}`,
        data: {
          type: ContentType.DISPOSITIF,
          contentId: demarche._id.toString(),
        },
      };
    }),
  );

  const messages = await getNotificationsToSend(savedNotifications, tokens);
  await sendNotifications(messages);

  const payload = demarche?.notificationsSent || {};
  for (const lang of availableLanguages) {
    payload[lang] = true;
  }
  await updateDispositifInDB(demarcheId, { notificationsSent: payload });
};

export const sendDemarcheNotifications = async (demarcheId: DispositifId) => {
  const notificationActive = await isNotificationsActive();
  if (notificationActive) {
    logger.error("[sendDemarcheNotifications] notifications actives");
    try {
      const demarche: Dispositif = await getDispositifById(
        demarcheId,
        {
          status: 1,
          typeContenu: 1,
          theme: 1,
          notificationsSent: 1,
          metadatas: 1,
          translations: 1,
        },
        "theme",
      );

      if (!demarche || !isDemarche(demarche)) {
        // not a demarche: error
        logger.error(`[sendDemarcheNotifications] demarche ${demarcheId} not found`);
        return;
      }

      const requirements = parseDispositif(demarche);
      if (!requirements) {
        logger.error(
          `[sendDemarcheNotifications] demarche ${demarcheId} - Failed to parse requirements`,
        );
        return;
      }

      await processAppUsersByBatch(100, (users) =>
        sendDemarcheNotificationsBatch(users, demarche, requirements),
      );
    } catch (err) {
      logger.error("[sendDemarcheNotifications]", err);
    }
  } else {
    logger.error("[sendDemarcheNotifications] not active: nothing sent");
  }
};

export default {
  expo,
  isNotificationsActive,
  getNotificationsForUser,
  markNotificationAsSeen,
  sendNotifications,
  sendDispositifNotifications,
  sendDemarcheNotifications,
};
