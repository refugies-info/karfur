import { ObjectId } from "mongoose";
import { Expo, ExpoPushMessage } from "expo-server-sdk";

import { getDispositifById, updateDispositifInDB } from "../../modules/dispositif/dispositif.repository";
import { getAllAppUsers } from "../../modules/appusers/appusers.repository";
import { Notification } from "../../schema/schemaNotification";

import logger from "../../logger";
import { getLocaleString as t } from "../../libs/getLocaleString";
import { availableLanguages } from "../../libs/getFormattedLocale";

import { parseDispositif, filterTargets, filterTargetsForDemarche, getNotificationEmoji, getTitle } from "./helpers";
import { getAdminOption } from "../adminOptions/adminOptions.repository";

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

const isNotificationsActive = async () => {
  const adminOption = await getAdminOption("activesNotifications");
  return !adminOption || adminOption.value === true;
}

export const getNotificationsForUser = async (uid: string) => {
  const notifications = await Notification.find({ uid }).limit(15).sort({ createdAt: -1 });
  return notifications;
};

export const markNotificationAsSeen = async (notificationId: string, uid: string) => {
  try {
    const notification = await Notification.findOne({ _id: notificationId, uid });
    if (notification) {
      notification.seen = true;
      await notification.save();
    }
    return true;
  } catch (error) {
    logger.error("[markNotificationAsSeen] error while marking notification as seen", { error: error.message });
    return false;
  }
};

export const sendNotifications = async (messages: ExpoPushMessage[]) => {
  const notificationActive = await isNotificationsActive();
  // already added in sendNotificationsForDispositif but replicated here
  // to be more secure if new feature in the future
  if (notificationActive) {
    const chunks = expo.chunkPushNotifications(messages);

    await Promise.all(
      chunks.map(async (chunk) => {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          return ticketChunk;
        } catch (error) {
          logger.error("[sendNotifications]", error);
        }
      })
    );
  }
};

export const sendNotificationsForDispositif = async (dispositifId: string | ObjectId, lang: string = "en") => {
  const notificationActive = await isNotificationsActive();
  if (notificationActive) {
    logger.error("[sendNotificationsForDispositif] notifications actives");
    try {
      const dispositif = await getDispositifById(dispositifId, {
        status: 1,
        titreMarque: 1,
        typeContenu: 1,
        titreInformatif: 1,
        contenu: 1,
        tags: 1,
        notificationsSent: 1
      });

      if (!dispositif) {
        logger.error(`[sendNotificationsForDispositif] dispositif ${dispositifId} not found`);
        return;
      }

      if (dispositif.notificationsSent && dispositif.notificationsSent[lang]) {
        logger.info(
          `[sendNotificationsForDispositif] dispositif ${dispositifId} notifications already sent for lang ${lang}`
        );
        return;
      }

      const requirements = parseDispositif(dispositif);
      if (!requirements) {
        logger.error(`[sendNotificationsForDispositif] dispositif ${dispositifId} - Failed to parse requirements`);
        return;
      }

      const targetUsers = filterTargets(await getAllAppUsers(), requirements, lang);

      logger.info(`[sendNotificationsForDispositif] dispositif ${dispositifId} - ${targetUsers.length} users found`);

      const tokens = {} as Record<string, string>;
      targetUsers.forEach((user) => {
        if (user.expoPushToken) {
          tokens[user.uid] = user.expoPushToken;
        }
      });

      const savedNotifications = await Notification.insertMany(
        targetUsers.map((user) => {
          return {
            uid: user.uid,
            seen: false,
            title: `${getNotificationEmoji(dispositif)} ${t(lang, "notifications.newOffer")} - ${getTitle(
              dispositif.titreInformatif, lang
            )} ${t(lang, "notifications.with")} ${getTitle(dispositif.titreMarque)}`,
            data: {
              type: "dispositif",
              // @ts-ignore
              contentId: dispositif._id.toString()
            }
          };
        })
      );

      const messages: ExpoPushMessage[] = savedNotifications
        .map((notification) => {
          return {
            to: tokens[notification.uid],
            title: "Réfugiés.info",
            body: notification.title,
            data: {
              ...notification.data,
              notificationId: notification._id.toString()
            }
          };
        })
        .filter((message) => message.to);

      await sendNotifications(messages);

      const payload = dispositif?.notificationsSent || {};
      payload[lang] = true;
      await updateDispositifInDB(dispositifId, { notificationsSent: payload });
    } catch (err) {
      logger.error("[sendNotificationsForDispositif]", err);
    }
  } else {
    logger.error("[sendNotificationsForDispositif] not active: nothing sent",);
  }
};

export const sendNotificationsForDemarche = async (demarcheId: string | ObjectId) => {
  const notificationActive = await isNotificationsActive();
  if (notificationActive) {
    logger.error("[sendNotificationsForDemarche] notifications actives");
    try {
      const demarche = await getDispositifById(demarcheId, {
        status: 1,
        typeContenu: 1,
        titreInformatif: 1,
        contenu: 1,
        tags: 1,
        notificationsSent: 1
      });

      if (!demarche || demarche.typeContenu !== "demarche") { // not a demarche: error
        logger.error(`[sendNotificationsForDemarche] demarche ${demarcheId} not found`);
        return;
      }

      const requirements = parseDispositif(demarche);
      if (!requirements) {
        logger.error(`[sendNotificationsForDemarche] demarche ${demarcheId} - Failed to parse requirements`);
        return;
      }

      const targetUsers = filterTargetsForDemarche(await getAllAppUsers(), requirements);

      logger.info(`[sendNotificationsForDemarche] demarche ${demarcheId} - ${targetUsers.length} users found`);

      const tokens = {} as Record<string, string>;
      targetUsers.forEach((user) => {
        if (user.expoPushToken) {
          tokens[user.uid] = user.expoPushToken;
        }
      });

      const savedNotifications = await Notification.insertMany(
        targetUsers.map((user) => {
          const lang = user.selectedLanguage || "fr";
          return {
            uid: user.uid,
            seen: false,
            title: `${getNotificationEmoji(demarche)} ${t(lang, "notifications.newOffer")} : ${getTitle(
              demarche.titreInformatif, lang
            )}`,
            data: {
              type: "dispositif",
              // @ts-ignore
              contentId: demarche._id.toString()
            }
          };
        })
      );

      const messages: ExpoPushMessage[] = savedNotifications
        .map((notification) => {
          return {
            to: tokens[notification.uid],
            title: "Réfugiés.info",
            body: notification.title,
            data: {
              ...notification.data,
              notificationId: notification._id.toString()
            }
          };
        })
        .filter((message) => message.to);

      await sendNotifications(messages);

      const payload = demarche?.notificationsSent || {};
      for (const lang of availableLanguages) {
        payload[lang] = true;
      }
      await updateDispositifInDB(demarcheId, { notificationsSent: payload });
    } catch (err) {
      logger.error("[sendNotificationsForDemarche]", err);
    }
  } else {
    logger.error("[sendNotificationsForDemarche] not active: nothing sent",);
  }
};
